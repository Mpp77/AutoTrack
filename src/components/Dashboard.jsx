import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { db } from "../firebase/config";
import { collection, onSnapshot, query } from "firebase/firestore";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import { useTranslation } from "react-i18next";
import "../App.css";

const COLORS = ["#2e82ff", "#00bfff", "#ff7f24", "#ffd700", "#ff4d4d", "#32cd32", "#ff69b4", "#8a2be2"];

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const currencySymbol = i18n.language === "ro" ? "lei" : "€";
  const exchangeRate = 0.20; // 1 leu ≈ 0.20 euro

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

  // 🔹 Grupare cheltuieli pe categorii + validare valori
  const data = expenses.reduce((acc, expense) => {
    const amount = parseFloat(expense.amount);
    if (isNaN(amount) || amount <= 0) return acc;

    const category = expense.category || t("Unknown");

    const existing = acc.find((item) => item.name === category);
    if (existing) {
      existing.value += amount;
    } else {
      acc.push({
        name: category,
        value: amount,
      });
    }
    return acc;
  }, []);

  // 🔹 Etichete personalizate (două rânduri, centrate)
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }) => {
    const RADIAN = Math.PI / 130;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (!data[index]) return null;
    const label = t(data[index].name);

    const words = label.split(" ");
    const firstLine = words[0];
    const secondLine = words.slice(1).join(" ");

    return (
      <text
        x={x}
        y={y}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fill={COLORS[index % COLORS.length]}
        fontSize={13}
        fontFamily="'Inter', 'Roboto', sans-serif"
      >
        <tspan x={x} dy="-0.4em">
          {firstLine}
        </tspan>
        {secondLine && (
          <tspan x={x} dy="1.2em">
            {secondLine}
          </tspan>
        )}
      </text>
    );
  };

  return (
    <div className="dashboard-container flex flex-col items-center mt-10">
      <h2 className="text-3xl font-bold mb-6 text-white tracking-wide">
        {t("expenseOverview")}
      </h2>

      {/* 🔹 Grafic circular mare, centrat */}
      <div className="bg-[#0b1320]/70 p-6 rounded-2xl shadow-xl border border-[#1e3a8a]/50 mb-8 flex justify-center items-center">
        {data.length > 0 ? (
          <ResponsiveContainer width={400} height={550}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="80%"           // 🔹 ridicat ușor, să nu fie tăiat jos
                outerRadius={80}  // 🔹 mai mare, clar vizibil
                labelLine={false}
                //label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => {
                  const displayValue =
                    i18n.language === "ro"
                      ? value
                      : (value * exchangeRate).toFixed(2);
                  return [`${displayValue} ${currencySymbol}`, t(name)];
                }}
                contentStyle={{
                  backgroundColor: "#0d1a2f",
                  border: "1px solid #1e3a8a",
                  color: "#fff",
                }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={10}
                wrapperStyle={{
                  marginTop: "10px",
                  color: "#fff",
                  fontSize: "13px",
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
