import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL, fetchCurrentExchangeRate } from "../api";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const selectedCurrency = localStorage.getItem("currency") || "RON";
  
  // Modificat înapoi la 0.19 ca valoare de pornire/fallback
  const [eurToRonRate, setEurToRonRate] = useState(0.19);

  useEffect(() => {
    const loadRateAndExpenses = async () => {
      try {
        const liveRate = await fetchCurrentExchangeRate();
        // API-ul returnează ~4.97 (EUR->RON). Nouă ne trebuie invers pentru logica ta: 1 / 4.97 = ~0.20
        setEurToRonRate(1 / liveRate);
      } catch (error) {
        console.error("Eroare la curs live, se folosește fallback 0.19", error);
      }

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

    loadRateAndExpenses();
  }, []);

  const grouped = expenses.reduce((acc, exp) => {
    if (!exp.category) return acc;
    const cat = exp.category.trim();
    if (!acc[cat]) acc[cat] = { total: 0 };
    let amount = parseFloat(exp.amount) || 0;

    // RESTAURAT: Logica ta matematică originală cu înmulțire/împărțire
    if (exp.currency === "RON" && selectedCurrency === "EUR") {
      amount = amount * eurToRonRate; 
    } else if (exp.currency === "EUR" && selectedCurrency === "RON") {
      amount = amount / eurToRonRate; 
    }
    
    acc[cat].total += amount;
    return acc;
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