import { PieChart, Pie, Cell, Tooltip } from "recharts";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import "../App.css";

const data = [
  { name: "Fuel", value: 400 },
  { name: "Service", value: 300 },
  { name: "Insurance", value: 200 },
];

const COLORS = ["#3b82f6", "#a855f7", "#f97316"];

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="app-title mb-8">AutoTrack Dashboard</h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-10">
        {/* 📊 Grafic */}
        <div className="glass-card w-fit">
          <PieChart width={300} height={250}>
            <Pie data={data} dataKey="value" outerRadius={80} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <p className="text-sm text-gray-300 mt-2">Expense Breakdown</p>
        </div>

        {/* 🧾 Formular + Listă */}
        <div className="glass-card w-full md:w-96">
          <ExpenseForm />
          <ExpenseList />
        </div>
      </div>
    </div>
  );
}
