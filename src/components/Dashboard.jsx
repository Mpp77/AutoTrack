import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "./ExpenseForm";
import { API_URL } from "../api";
import "../App.css";

const COLORS = ["#2e82ff", "#00bfff", "#ff7f24", "#ffd700", "#ff4d4d", "#32cd32", "#8b5cf6"];

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);

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

      const grouped = data.reduce((acc, exp) => {
        const cat = exp.category?.trim();
        const amount = parseFloat(exp.amount || 0);

        if (!cat) return acc;

        acc[cat] = (acc[cat] || 0) + amount;
        return acc;
      }, {});

      const formatted = Object.entries(grouped).map(([name, value]) => ({
        name,
        value,
      }));

      setChartData(formatted);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="dashboard-container flex flex-col items-center min-h-screen text-white px-4 py-6">
      <div className="text-center mt-4 mb-6">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
          AutoTrack Dashboard
        </h1>
        <p className="text-blue-300 text-sm mt-2 tracking-widest uppercase">
          {t("expenseOverview")}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="chart-card w-full max-w-2xl mb-8"
      >
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) =>
                  `${t(name, name)}: ${(percent * 100).toFixed(0)}%`
                }
                onClick={(_, index) => navigate(`/category/${chartData[index].name}`)}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [
                  `${value} ${t("currency")}`,
                  t(name, name),
                ]}
              />

              <Legend
                formatter={(value) => t(value, value)}
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={10}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-400 italic">{t("noData")}</p>
        )}
      </motion.div>

      <div className="w-full max-w-lg glass-section mb-8">
        <h3 className="mb-4">{t("addExpense")}</h3>
        <ExpenseForm onExpenseAdded={fetchExpenses} />
      </div>

      {chartData.length > 0 && (
        <div className="w-full max-w-lg glass-section">
          <h3 className="mb-4">{t("expenseList")}</h3>
          <div className="grid grid-cols-2 gap-3">
            {chartData.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(`/category/${item.name}`)}
                className="rounded-xl"
              >
                {t(item.name, item.name)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}