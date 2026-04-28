import { useNavigate } from "react-router-dom";
import ExpenseList from "./ExpenseList";
import "../App.css";

export default function ExpenseListPage() {
  const navigate = useNavigate();

  return (
    <div className="list-page">
      <button onClick={() => navigate("/home")} className="back-home-btn">
        ← Back Home
      </button>
  
      <div className="list-card">
        <h1 className="list-title">Expense List</h1>
        <ExpenseList />
      </div>
    </div>
  );
}