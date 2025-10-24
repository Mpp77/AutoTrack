import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useTranslation } from "react-i18next";

export default function ExpenseForm() {
  const { t, i18n } = useTranslation();
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState(""); // 🔹 pentru categorie nouă
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  // 🔹 Am adăugat "Rovinieta"
  const categories = [
    "Fuel",
    "Service",
    "Insurance",
    "ITP",
    "Oil Change",
    "Tuning",
    "Unexpected Repairs",
    "Rovinieta",
    "OtherCategory", // 🔹 opțiune pentru categorie personalizată
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !amount) return;

    // 🔹 dacă user-ul alege "Altă categorie", folosește textul din input
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

    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-3 text-white"
    >
      <div className="flex flex-col w-full gap-2">
        {/* 🔹 Select pentru categorie */}
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

        {/* 🔹 Input pentru categorie personalizată */}
        {category === "OtherCategory" && (
          <input
            type="text"
            placeholder={t("enterCustomCategory")}
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="bg-[#0d1a2f]/70 border border-[#1e3a8a] rounded-lg p-2 text-sm text-gray-300 focus:outline-none"
          />
        )}

        {/* 🔹 Suma */}
        <input
          type="number"
          placeholder={t("amount")}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-[#0d1a2f]/70 border border-[#1e3a8a] rounded-lg p-2 text-sm text-gray-300 focus:outline-none"
        />

        {/* 🔹 Notă opțională */}
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
