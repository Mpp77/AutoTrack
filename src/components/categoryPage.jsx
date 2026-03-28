import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL } from "../api";

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [expenses, setExpenses] = useState([]);
  const [newAmount, setNewAmount] = useState("");
  const [newNote, setNewNote] = useState("");
  const [message, setMessage] = useState("");

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

      const filtered = data.filter(
        (exp) =>
          exp.category?.trim().toLowerCase() === category?.trim().toLowerCase()
      );

      setExpenses(filtered);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [category]);

  const total = expenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount || 0),
    0
  );

  const handleDelete = async (id) => {
    if (!window.confirm(t("deleteExpenseConfirm"))) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/expenses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      }

      fetchExpenses();
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const handleUpdate = async (id, amount, note) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          note,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      fetchExpenses();
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const handleAddExpenseInCategory = async () => {
    if (!newAmount) {
      setMessage("Please enter amount");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
          amount: parseFloat(newAmount),
          note: newNote,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Add failed");
      }

      setNewAmount("");
      setNewNote("");
      fetchExpenses();
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen text-white px-6 py-8">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-bold mb-4">{t(category, category)}</h1>
      <p className="mb-6 text-lg">
        Total: {total} {t("currency")}
      </p>

      <div className="mb-8 p-4 rounded-xl bg-[#0d1a2f]/70 border border-[#1e3a8a]">
        <h2 className="text-xl font-semibold mb-3">Add expense</h2>
        <div className="flex flex-col gap-3">
          <input
            type="number"
            placeholder={t("amount")}
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="bg-[#0d1a2f]/80 border border-[#1e3a8a]/80 text-white px-4 py-3 rounded-md"
          />
          <input
            type="text"
            placeholder={t("noteOptional")}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="bg-[#0d1a2f]/80 border border-[#1e3a8a]/80 text-white px-4 py-3 rounded-md"
          />
          <button
            onClick={handleAddExpenseInCategory}
            className="bg-gradient-to-r from-[#007bff] to-[#00bfff] text-white font-semibold py-3 rounded-md"
          >
            {t("saveExpense")}
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {expenses.map((exp) => (
          <ExpenseCard
            key={exp.id}
            exp={exp}
            currency={t("currency")}
            onDelete={handleDelete}
            onSave={handleUpdate}
          />
        ))}
      </div>

      {message && <p className="mt-4 text-red-400">{message}</p>}
    </div>
  );
}

function ExpenseCard({ exp, currency, onDelete, onSave }) {
  const [amount, setAmount] = useState(exp.amount);
  const [note, setNote] = useState(exp.note || "");

  return (
    <div className="p-4 rounded-xl bg-[#0d1a2f]/70 border border-[#1e3a8a]">
      <div className="flex flex-col gap-3">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-[#0d1a2f]/80 border border-[#1e3a8a]/80 text-white px-4 py-2 rounded-md"
        />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="bg-[#0d1a2f]/80 border border-[#1e3a8a]/80 text-white px-4 py-2 rounded-md"
        />
        <p className="text-sm text-gray-300">
          {amount} {currency}
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => onSave(exp.id, amount, note)}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500"
          >
            Save
          </button>
          <button
            onClick={() => onDelete(exp.id)}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}