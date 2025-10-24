import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isCreatingAccount) {
        // 🔹 Creează un cont nou
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        // 🔹 Salvează în Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: serverTimestamp(),
        });

        setMessage("✅ Account created and saved in Firestore!");
      } else {
        // 🔹 Login
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("✅ Logged in successfully!");
      }

      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage("❌ " + error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", color: "white", marginTop: "100px" }}>
      <h1>🚗 AutoTrack</h1>
      <h2>{isCreatingAccount ? "Create Account" : "Login"}</h2>

      <form onSubmit={handleSubmit} style={{ display: "inline-block" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "8px", margin: "5px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "8px", margin: "5px" }}
        />
        <button type="submit" style={{ padding: "8px 16px", margin: "5px" }}>
          {isCreatingAccount ? "Create Account" : "Sign In"}
        </button>
      </form>

      <p>
        {isCreatingAccount ? (
          <>
            Already have an account?{" "}
            <button
              onClick={() => setIsCreatingAccount(false)}
              style={{ background: "none", border: "none", color: "lightblue" }}
            >
              Sign In
            </button>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <button
              onClick={() => setIsCreatingAccount(true)}
              style={{ background: "none", border: "none", color: "lightblue" }}
            >
              Create one
            </button>
          </>
        )}
      </p>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  );
}
