import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
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
  
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  
  const [selectedCategory, setSelectedCategory] = useState("All");

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
      const amount = parseFloat(exp.amount || 0);

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
  }, [allExpenses, startDate, endDate, selectedCategory]);

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

  return (
    <div className="overview-page">
      <button onClick={() => navigate("/home")} className="back-btn">
        ← {t("backHome")}
      </button>

      <div className="overview-card">
        <h1>{t("expenseOverview")}</h1>

        <div className="filters-row">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="filter-input"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="filter-input"
          />

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
          {t("total")}: {totalSpent.toFixed(2)} {t("currency")}
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
              onClick={(_, index) =>
                navigate(`/category/${chartData[index].name}`)
              }
            >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [
                  `${value} ${t("currency")}`,
                  t(name, name),
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

                    <div
            className="chart-legend"
            style={{
              color: "white",
              WebkitTextFillColor: "white",
              maxWidth: "320px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {chartData.map((item, index) => (
              <div
                key={item.name}
                className="chart-legend-item"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  background: "rgba(0,25,70,0.95)",
                  border: "1px solid rgba(0,191,255,0.35)",
                  color: "white",
                  WebkitTextFillColor: "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flex: 1,
                  }}
                >
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "4px",
                      backgroundColor: COLORS[index % COLORS.length],
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />

                  <span
                    style={{
                      color: "white",
                      WebkitTextFillColor: "white",
                      fontWeight: 700,
                      fontSize: "14px",
                    }}
                  >
                    {t(item.name, item.name)}
                  </span>
                </div>

                <strong
                  style={{
                    color: "white",
                    WebkitTextFillColor: "white",
                    fontWeight: 800,
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.value.toFixed(2)} {t("currency")}
                </strong>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-400 italic">
          {t("noData")}
        </p>
      )}
    </div>
      </div>
    </div>
  );
}