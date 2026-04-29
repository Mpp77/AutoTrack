import { useNavigate } from "react-router-dom";
import ExpenseForm from "./ExpenseForm";
import "../App.css";

export default function AddExpensePage() {
  const navigate = useNavigate();

  return (
    <div className="add-expense-page">
      <button onClick={() => navigate("/home")} className="back-btn">
        ← Back Home
      </button>
  
      <div className="add-expense-card">
        <h1>Add New Expense</h1>
        <ExpenseForm />
      </div>
    </div>
  );
}