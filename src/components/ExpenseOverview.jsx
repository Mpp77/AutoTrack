import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import "../App.css";

const COLORS = [
  "#2e82ff",
  "#00bfff",
  "#ff7f24",
  "#ffd700",
  "#ff4d4d",
  "#32cd32",
  "#8b5cf6",
];

export default function ExpenseOverview() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [allExpenses, setAllExpenses] = useState([]);
  const [chartData, setChartData] = useState([]);
  
  // Starea inițială este complet goală ("") ca să afișeze tot istoricul!
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [selectedCategory, setSelectedCategory] = useState("All");

  const selectedCurrency = localStorage.getItem("currency") || "RON";
  const exchangeRate = 0.19;

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setAllExpenses(data);
    };

    fetchExpenses();
  }, []);

  useEffect(() => {
    let filtered = [...allExpenses];

    // Aplicăm filtrele doar dacă utilizatorul a selectat o dată
    if (startDate) {
      filtered = filtered.filter(
        (exp) => new Date(exp.created_at) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (exp) => new Date(exp.created_at) <= new Date(endDate + "T23:59:59")
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (exp) =>
          exp.category?.trim().toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    const grouped = filtered.reduce((acc, exp) => {
      const cat = exp.category?.trim();
      let amount = parseFloat(exp.amount || 0);

      if (exp.currency === "RON" && selectedCurrency === "EUR") {
        amount = amount * exchangeRate;
      } else if (exp.currency === "EUR" && selectedCurrency === "RON") {
        amount = amount / exchangeRate;
      }
      if (!cat) return acc;

      acc[cat] = (acc[cat] || 0) + amount;
      return acc;
    }, {});

    setChartData(
      Object.entries(grouped).map(([name, value]) => ({
        name,
        value,
      }))
    );
  }, [allExpenses, startDate, endDate, selectedCategory, selectedCurrency]);

  const categories = [
    "All",
    "Fuel",
    "Service",
    "Insurance",
    "ITP",
    "Oil Change",
    "Tuning",
    "Unexpected Repairs",
    "Rovinieta",
    "OtherCategory",
  ];

  const totalSpent = chartData.reduce((sum, item) => sum + item.value, 0);

  const currencySymbols = {
    RON: "Lei",
    EUR: "€",
  };
  
  const currency = currencySymbols[localStorage.getItem("currency")] || "Lei";

  return (
    <div className="overview-page">
      <button onClick={() => navigate("/home")} className="back-btn">
        ← {t("backHome")}
      </button>

      <div className="overview-card">
        <h1>{t("expenseOverview")}</h1>

        <div className="filters-row">

        <div className="date-field">
  <span className={startDate ? "date-label filled" : "date-label"}>
    {t("fromDate")}
  </span>
  <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className="filter-input date-input"
    autoComplete="off"
    inputMode="none"
  />
</div>

<div className="date-field">
  <span className={endDate ? "date-label filled" : "date-label"}>
    {t("toDate")}
  </span>
  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    className="filter-input date-input"
    autoComplete="off"
    inputMode="none"
  />
</div>

  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="filter-input"
  >
    {categories.map((cat) => (
      <option key={cat} value={cat}>
        {cat === "All" ? t("allCategories") : t(cat, cat)}
      </option>
    ))}
  </select>
</div>
        <p className="overview-total">
          {t("total")}: {totalSpent.toFixed(2)} {currency}
        </p>

        <div className="chart-wrapper">
          {chartData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart margin={{ top: 10, right: 45, bottom: 40, left: 45 }}>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="45%"
                    outerRadius={75}
                    dataKey="value"
                    label={false}
                    labelLine={false}
                    onClick={(_, index) => navigate(`/category/${chartData[index].name}`)}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value, name) => [
                      `${Number(value).toFixed(2)} ${currency}`, t(name, name),
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="chart-legend">
                {chartData.map((item, index) => (
                  <div key={item.name} className="legend-row">
                    <div className="legend-left">
                      <span
                        className="legend-color"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="legend-label">
                        {t(item.name, item.name)}
                      </span>
                    </div>

                    <span className="legend-value">
                      {item.value.toFixed(2)} {currency}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="no-data-text">
  {t("noData", "No expenses recorded yet.")}
</p>
          )}
        </div>
      </div>
    </div>
  );
}