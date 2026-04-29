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
    <div className="category-page">
      <button onClick={() => navigate("/expenses")} className="back-home-btn">
      ← {t("back")}
      </button>
  
      <div className="category-card">
        <h1 className="category-title">{t(category, category)}</h1>
  
        <p className="category-total">
          Total: {total} {t("currency")}
        </p>
  
        <div className="category-add-box">
          <h2>{t("addExpenseSimple")}</h2>
  
          <div className="category-form">
            <input
              type="number"
              placeholder={t("amount")}
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
            />
  
            <input
              type="text"
              placeholder={t("noteOptional")}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
  
            <button onClick={handleAddExpenseInCategory}>
              {t("saveExpense")}
            </button>
          </div>
        </div>
  
        <div className="category-expense-grid">
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
  
        {message && <p className="category-message">{message}</p>}
      </div>
    </div>
  );
}

function ExpenseCard({ exp, currency, onDelete, onSave }) {
  const [amount, setAmount] = useState(exp.amount);
  const [note, setNote] = useState(exp.note || "");

  return (
    <div className="category-expense-card">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
  
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
  
      <p>
        {amount} {currency}
      </p>
  
      <p className="expense-date">
      {t("addedOn")}: {new Date(exp.created_at).toLocaleDateString("ro-RO")}
      </p>

      <div className="category-card-actions">
        <button onClick={() => onSave(exp.id, amount, note)}>Save</button>
        <button onClick={() => onDelete(exp.id)}>Delete</button>
      </div>
    </div>
  );
}