import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import "../App.css";

const COLORS = ["#2e82ff", "#00bfff", "#ff7f24", "#ffd700", "#ff4d4d", "#32cd32", "#8b5cf6"];

export default function ExpenseOverview() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const grouped = data.reduce((acc, exp) => {
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
    };

    fetchExpenses();
  }, []);

  return (
    <div className="overview-page">
      <button
        onClick={() => navigate("/home")}
        className="back-btn"
      >
        ← Back Home
      </button>
  
      <div className="overview-card">
        <h1>{t("expenseOverview")}</h1>
  
        <div className="chart-wrapper">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={520}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="45%"
                  outerRadius={150}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${t(name, name)}: ${(percent * 100).toFixed(0)}%`
                  }
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
  
                <Legend formatter={(value) => t(value, value)} />
              </PieChart>
            </ResponsiveContainer>
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