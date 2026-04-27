import { useNavigate } from "react-router-dom";
import ExpenseForm from "./ExpenseForm";
import "../App.css";

export default function AddExpensePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white px-6 py-8 bg-gradient-to-br from-[#030b18] via-[#081a36] to-[#0f294e]">
      <button
        onClick={() => navigate("/home")}
        className="mb-8 px-5 py-2 rounded-xl bg-gradient-to-r from-[#007bff] to-[#00bfff] font-semibold"
      >
        ← Back Home
      </button>

      <div className="max-w-xl mx-auto glass-section">
        <h1 className="text-4xl font-bold text-center mb-8 text-cyan-300">
          Add New Expense
        </h1>

        <ExpenseForm />
      </div>
    </div>
  );
}