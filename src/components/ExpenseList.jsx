import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL } from "../api";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/expenses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch expenses");
        }

        setExpenses(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExpenses();
  }, []);

  const grouped = expenses.reduce((acc, exp) => {
    if (!exp.category) return acc;
    const cat = exp.category.trim();
    if (!acc[cat]) acc[cat] = { total: 0 };
    acc[cat].total += parseFloat(exp.amount) || 0;
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => navigate(`/category/${cat}`)}
          className="rounded-xl p-3 bg-[#0d1a2f]/70 border border-[#1e3a8a] hover:bg-[#13213d]"
        >
          {t(cat, cat)} - {grouped[cat].total} {t("currency")}
        </button>
      ))}
    </div>
  );
}