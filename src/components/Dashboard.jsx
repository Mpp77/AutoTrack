import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { db } from "../firebase/config";
import { collection, onSnapshot, query } from "firebase/firestore";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import { useTranslation } from "react-i18next";
import "../App.css";

const COLORS = ["#2e82ff", "#00bfff", "#ff7f24", "#ffd700", "#ff4d4d"];

export default function Dashboard() {
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState([]);

  // 🔹 Preluare date din Firestore
  useEffect(() => {
    const q = query(collection(db, "expenses"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setExpenses(data);
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Grupare cheltuieli pe categorii
  const data = expenses.reduce((acc, expense) => {
    const existing = acc.find((item) => item.name === expense.category);
    if (existing) {
      existing.value += parseFloat(expense.amount);
    } else {
      acc.push({
        name: expense.category,
        value: parseFloat(expense.amount),
      });
    }
    return acc;
  }, []);

  // 🔹 Etichete personalizate — ca să apară corect textul cu diacritice
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (!data[index]) return null;

    // 🔹 Textul complet, fără a fi tăiat
    const label = t(data[index].name);

    return (
      <foreignObject
        x={x - 60}
        y={y - 10}
        width={120}
        height={30}
        style={{
          overflow: "visible",
          textAlign: "center",
        }}
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            fontFamily: "'Inter', 'Roboto', sans-serif",
            fontSize: "13px",
            color: COLORS[index % COLORS.length],
            whiteSpace: "nowrap",
            textShadow: "0 0 3px rgba(0,0,0,0.8)",
          }}
        >
          {label}
        </div>
      </foreignObject>
    );
  };

  return (
    <div className="dashboard-container flex flex-col items-center mt-10">
      <h2 className="text-3xl font-bold mb-6 text-white tracking-wide">
        {t("expenseOverview")}
      </h2>

      {/* 🔹 Grafic circular */}
      <div className="bg-[#0b1320]/70 p-6 rounded-2xl shadow-xl border border-[#1e3a8a]/50 mb-8">
        {data.length > 0 ? (
          <ResponsiveContainer width={300} height={250}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="70%"
                outerRadius={70}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${value} €`,
                  t(name),
                ]}
                contentStyle={{
                  backgroundColor: "#0d1a2f",
                  border: "1px solid #1e3a8a",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-300 italic">{t("noData")}</p>
        )}
      </div>

      {/* 🔹 Formular cheltuieli */}
      <div className="glass-section w-full max-w-md mb-6">
        <h3 className="text-xl font-semibold mb-3 text-white">
          {t("addExpense")}
        </h3>
        <ExpenseForm />
      </div>

      {/* 🔹 Lista cheltuieli */}
      <div className="glass-section w-full max-w-md">
        <h3 className="text-xl font-semibold mb-3 text-white">
          {t("expenseList")}
        </h3>
        <ExpenseList />
      </div>
    </div>
  );
}