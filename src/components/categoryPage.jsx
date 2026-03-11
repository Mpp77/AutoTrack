import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useTranslation } from "react-i18next";

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [expenses, setExpenses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "expenses"), (snap) => {
      const filtered = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (exp) =>
            exp.category?.trim().toLowerCase() === category?.trim().toLowerCase()
        );

      setExpenses(filtered);
    });

    return () => unsub();
  }, [category]);

  const total = expenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount || 0),
    0
  );

  const handleDelete = async (id) => {
    if (window.confirm(t("deleteExpenseConfirm"))) {
      await deleteDoc(doc(db, "expenses", id));
    }
  };

  const handleEdit = async (id, newAmountValue, newNoteValue) => {
    await updateDoc(doc(db, "expenses", id), {
      amount: parseFloat(newAmountValue),
      note: newNoteValue,
    });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!newAmount) return;

    await addDoc(collection(db, "expenses"), {
      category,
      amount: parseFloat(newAmount),
      note: newNote,
      createdAt: serverTimestamp(),
    });

    setNewAmount("");
    setNewNote("");
  };

  return (
    <div className="flex flex-col items-center justify-start p-6 text-white min-h-screen">
      <div className="flex gap-3 mb-8 mt-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition"
        >
          ← {t("backToDashboard")}
        </button>

        <button
          onClick={() => setEditMode(!editMode)}
          className="bg-gradient-to-r from-blue-400 to-blue-500 px-5 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition flex items-center gap-2"
        >
          ✏️ {editMode ? t("done") : t("edit")}
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-8 drop-shadow-md text-center">
        💰 {t(category, category)} —{" "}
        <span className="text-blue-300">
          {total} {t("currency")}
        </span>
      </h2>

      <form
        onSubmit={handleAddExpense}
        className="w-full max-w-md mb-8 flex flex-col gap-3"
      >
        <input
          type="number"
          placeholder={t("amount")}
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          className="w-full bg-blue-900/40 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder={t("noteOptional")}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full bg-blue-900/40 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition"
        >
          {t("saveExpense")}
        </button>
      </form>

      <div className="flex flex-col gap-4 w-full max-w-md mt-4">
        {expenses.map((exp) => (
          <div
            key={exp.id}
            className="rounded-2xl bg-gradient-to-br from-blue-500/70 to-blue-400/40 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-md border border-blue-300/20 hover:scale-[1.03] hover:shadow-[0_6px_25px_rgba(59,130,246,0.5)] transition-all duration-300 text-center"
          >
            {editMode ? (
              <div className="flex flex-col gap-3">
                <input
                  type="number"
                  defaultValue={exp.amount}
                  onBlur={(e) => handleEdit(exp.id, e.target.value, exp.note)}
                  className="w-full bg-blue-900/40 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                  type="text"
                  defaultValue={exp.note || ""}
                  onBlur={(e) => handleEdit(exp.id, exp.amount, e.target.value)}
                  className="w-full bg-blue-900/40 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                  onClick={() => handleDelete(exp.id)}
                  className="text-sm text-red-400 hover:text-red-600 transition"
                >
                  🗑️ {t("delete")}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xl font-semibold text-white drop-shadow-md">
                  {exp.amount} {t("currency")}
                </p>

                {exp.note ? (
                  <p className="italic text-blue-100 opacity-90 mt-1 text-sm border-t border-blue-300/20 pt-1">
                    {exp.note}
                  </p>
                ) : (
                  <p className="italic text-blue-100 opacity-70 mt-1 text-sm border-t border-blue-300/20 pt-1">
                    {t("noNote")}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        {expenses.length === 0 && (
          <p className="text-gray-400 italic text-center mt-6">
            {t("noExpenses")}
          </p>
        )}
      </div>
    </div>
  );
}