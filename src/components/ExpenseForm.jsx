import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useTranslation } from "react-i18next";

export default function ExpenseForm() {
  const { t, i18n } = useTranslation();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const categories = [
    "Fuel",
    "Service",
    "Insurance",
    "ITP",
    "Oil Change",
    "Tuning",
    "Unexpected Repairs"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !amount) return;

    await addDoc(collection(db, "expenses"), {
      category,
      amount: parseFloat(amount),
      note,
      createdAt: serverTimestamp(),
    });

    setCategory("");
    setAmount("");
    setNote("");
    setMessage(t("expenseSaved"));

    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-3 text-white"
    >
      <div className="flex flex-col w-full gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-[#0d1a2f]/70 border border-[#1e3a8a] rounded-lg p-2 text-sm text-gray-300 focus:outline-none"
        >
          <option value="">{t("selectCategory")}</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {t(cat)}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder={t("amount")}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-[#0d1a2f]/70 border border-[#1e3a8a] rounded-lg p-2 text-sm text-gray-300 focus:outline-none"
        />

        <input
          type="text"
          placeholder={t("noteOptional")}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="bg-[#0d1a2f]/70 border border-[#1e3a8a] rounded-lg p-2 text-sm text-gray-300 focus:outline-none"
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-[#007bff] to-[#00bfff] hover:opacity-90 rounded-lg px-4 py-2 font-semibold transition"
        >
          {t("saveExpense")}
        </button>
      </div>

      {message && (
        <p className="text-green-400 font-medium mt-2">{message}</p>
      )}
    </form>
  );
}