import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useTranslation } from "react-i18next";

export default function ExpenseForm() {
  const { t } = useTranslation();
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
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
    "Unexpected Repairs",
    "Rovinieta",
    "OtherCategory"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    if (!category || !amount) {
      setMessage("Please complete category and amount");
      return;
    }
  
    try {
      const finalCategory =
        category === "OtherCategory" && customCategory
          ? customCategory
          : category;
  
      await addDoc(collection(db, "expenses"), {
        category: finalCategory,
        amount: parseFloat(amount),
        note,
        createdAt: serverTimestamp(),
      });
  
      setCategory("");
      setCustomCategory("");
      setAmount("");
      setNote("");
      setMessage(t("expenseSaved"));
    } catch (error) {
      console.error("Firestore save error:", error);
      setMessage(error.message);
    }
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
              {t(cat, cat)}
            </option>
          ))}
        </select>

        {category === "OtherCategory" && (
          <input
            type="text"
            placeholder={t("enterCustomCategory")}
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="bg-[#0d1a2f]/70 border border-[#1e3a8a] rounded-lg p-2 text-sm text-gray-300 focus:outline-none"
          />
        )}

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

      {message && <p className="text-green-400 font-medium mt-2">{message}</p>}
    </form>
  );
}