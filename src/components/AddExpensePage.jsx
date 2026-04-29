import { useNavigate } from "react-router-dom";
import ExpenseForm from "./ExpenseForm";
import "../App.css";
import { useTranslation } from "react-i18next";

export default function AddExpensePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="add-expense-page">
      <button onClick={() => navigate("/home")} className="back-btn">
      ← {t("backHome")} 
      </button>
  
      <div className="add-expense-card">
        <h1>Add New Expense</h1>
        <ExpenseForm />
      </div>
    </div>
  );
}