import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import ExpenseOverview from "./components/ExpenseOverview";
import AddExpensePage from "./components/AddExpensePage";
import ExpenseListPage from "./components/ExpenseListPage";
import CategoryPage from "./components/categoryPage";
import Settings from "./components/Settings";
import RemindersPage from "./components/RemindersPage";
import TalonPage from "./components/TalonPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/home" element={<Home />} />
      <Route path="/overview" element={<ExpenseOverview />} />
      <Route path="/add-expense" element={<AddExpensePage />} />
      <Route path="/expenses" element={<ExpenseListPage />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/reminders" element={<RemindersPage />} />
      <Route path="/talon" element={<TalonPage />} />
      <Route path="/category/:category" element={<CategoryPage />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}