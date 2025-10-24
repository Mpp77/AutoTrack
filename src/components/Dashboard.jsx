import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import "../App.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([
    { name: "Fuel", value: 400 },
    { name: "Service", value: 300 },
    { name: "Insurance", value: 200 },
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center mt-20 text-white">
        <h2 className="text-xl">Please log in to access your dashboard.</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-10 text-white">
      <h1 className="text-3xl font-bold mb-2">🚗 AutoTrack</h1>
      <h2 className="text-lg mb-6">Welcome, {user.email} 👋</h2>

      {/* ✅ graficul */}
      <h3 className="text-2xl font-semibold mb-4">Expense Overview</h3>
      <PieChart width={300} height={250}>
        <Pie data={data} dataKey="value" outerRadius={80} label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      {/* ✅ formularul și lista adăugate sub grafic */}
      <ExpenseForm />
      <ExpenseList />

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
      >
        Log out
      </button>
    </div>
  );
}
