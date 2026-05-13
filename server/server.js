import express from "express";
import cors from "cors";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { Pool } = pkg;
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://auto-track-sooty.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const SECRET = process.env.JWT_SECRET;

app.get("/", (req, res) => {
  res.send("Backend works");
});

app.options("/api/register", cors());
app.options("/api/login", cors());
app.options("/api/expenses", cors());
app.options("/api/expenses/:id", cors());
app.options("/api/reset-pasword", cors());
app.options("/api/user-settings", cors());

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users(email, password_hash) VALUES($1,$2) RETURNING id,email",
      [email, hash]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, SECRET);

    res.json({ token, user });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(400).json({ message: "User exists or register failed" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, SECRET);

    res.json({ token });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

app.post("/api/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password required" });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    const result = await pool.query(
      "UPDATE users SET password_hash=$1 WHERE email=$2 RETURNING email",
      [hash, email]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
});

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

app.get("/api/expenses", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM expenses WHERE user_id=$1 ORDER BY created_at DESC",
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("GET EXPENSES ERROR:", error);
    res.status(500).json({ message: "Failed to get expenses" });
  }
});

app.post("/api/expenses", auth, async (req, res) => {
  const { category, amount, note, currency = "RON" } = req.body;
  try {
    const result = await pool.query(
`INSERT INTO expenses(user_id, category, amount, note, currency)
 VALUES($1,$2,$3,$4,$5) RETURNING *`,
[req.user.userId, category, amount, note, currency]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("ADD EXPENSE ERROR:", error);
    res.status(500).json({ message: "Failed to add expense" });
  }
});

app.put("/api/expenses/:id", auth, async (req, res) => {
  const { amount, note, currency } = req.body;
  try {
    const result = await pool.query(
      `UPDATE expenses
 SET amount=$1, note=$2, currency=COALESCE($3, currency)
 WHERE id=$4 AND user_id=$5
 RETURNING *`,
[amount, note, currency, req.params.id, req.user.userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("UPDATE EXPENSE ERROR:", error);
    res.status(500).json({ message: "Failed to update expense" });
  }
});

app.delete("/api/expenses/:id", auth, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM expenses WHERE id=$1 AND user_id=$2",
      [req.params.id, req.user.userId]
    );

    res.json({ ok: true });
  } catch (error) {
    console.error("DELETE EXPENSE ERROR:", error);
    res.status(500).json({ message: "Failed to delete expense" });
  }
});

app.listen(5001, () => {
  console.log("🚀 Server running on port 5001");
});

// --- RUTE PENTRU SETĂRI PROFIL ȘI MAȘINĂ ---

// 1. GET: Preia datele mașinii și setările când intri în aplicație
app.get("/api/user-settings", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT car_plate, car_image, currency, itp_date, insurance_date, oil_date, target_km FROM users WHERE id=$1",
      [req.user.userId]
    );
    res.json(result.rows[0] || {});
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);
    res.status(500).json({ message: "Failed to get settings" });
  }
});

// 2. POST: Salvează/Actualizează datele din pagina de Settings
app.post("/api/user-settings", auth, async (req, res) => {
  const { 
    carPlate, 
    carImage, 
    currency, 
    itpDate, 
    insuranceDate, 
    oilDate, 
    targetKm 
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET car_plate=$1, car_image=$2, currency=$3, itp_date=$4, insurance_date=$5, oil_date=$6, target_km=$7
       WHERE id=$8 
       RETURNING car_plate, car_image, currency, itp_date, insurance_date, oil_date, target_km`,
      [
        carPlate || null, 
        carImage || null, 
        currency || 'RON', 
        itpDate || null, 
        insuranceDate || null, 
        oilDate || null, 
        targetKm || null, 
        req.user.userId
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("UPDATE SETTINGS ERROR:", error);
    res.status(500).json({ message: "Failed to update settings" });
  }
});