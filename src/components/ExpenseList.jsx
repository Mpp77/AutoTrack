import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL } from "../api";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const selectedCurrency = localStorage.getItem("currency") || "RON";
  const exchangeRate = 0.19;

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
    let amount = parseFloat(exp.amount) || 0;

    if (exp.currency === "RON" && selectedCurrency === "EUR") {
      amount = amount * exchangeRate;
    } else if (exp.currency === "EUR" && selectedCurrency === "RON") {
      amount = amount / exchangeRate;
    }
    
    acc[cat].total += amount;    return acc;
  }, {});

  const categories = Object.keys(grouped);

  const currencySymbols = {
    RON: "Lei",
    EUR: "€",
  };
  
  const currency =
    currencySymbols[localStorage.getItem("currency")] || "Lei";

    return (
      <div className="expense-list-container">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => navigate(`/category/${cat}`)}
            className="expense-item-card"
          >
            <div className="expense-item-left">
              <p className="expense-item-category">{t(cat, cat)}</p>
              {/* Un mic indicator vizual că este un buton */}
              <p className="expense-item-date">{t("viewDetails", "Vezi detalii")} →</p>
            </div>
            
            <div className="expense-item-right">
              <p className="expense-item-amount">
                {grouped[cat].total.toFixed(2)} {currency}
              </p>
            </div>
          </button>
        ))}
      </div>
    );
}