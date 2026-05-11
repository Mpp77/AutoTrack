import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "./ExpenseForm";
import "../App.css";
import { useTranslation } from "react-i18next";

export default function AddExpensePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "RON"
  );

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
    window.location.reload();
  };

  return (
    <div className="add-expense-page">
      <button onClick={() => navigate("/home")} className="back-btn">
        ← {t("backHome")}
      </button>

      <div className="add-expense-card">
        <div className="currency-top-right">
          <select value={currency} onChange={handleCurrencyChange}>
            <option value="RON">RON</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <h1>{t("addExpense")}</h1>
        <ExpenseForm />
      </div>
    </div>
  );
}