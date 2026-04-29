import { useNavigate } from "react-router-dom";
import ExpenseList from "./ExpenseList";
import "../App.css";
import { useTranslation } from "react-i18next";

export default function ExpenseListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="list-page">
      <button onClick={() => navigate("/home")} className="back-home-btn">
        ← {t("backHome")}
      </button>

      <div className="list-card">
        <h1 className="list-title">{t("expenseList")}</h1>
        <ExpenseList />
      </div>
    </div>
  );
}