import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 🔹 Preluăm datele din Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "expenses"), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setExpenses(data);
      console.log("📦 Date Firestore:", data);
    });
    return () => unsub();
  }, []);

  // 🔹 Grupăm cheltuielile pe categorii
  const grouped = expenses.reduce((acc, exp) => {
    if (!exp.category) return acc;
    const cat = exp.category.trim();
    if (!acc[cat]) acc[cat] = { total: 0 };
    acc[cat].total += parseFloat(exp.amount) || 0;
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  // 🔹 Culori calde pentru fiecare categorie
  const categoryColors = {
    Service: "bg-orange-100 hover:bg-orange-200 text-orange-900",
    Combustibil: "bg-yellow-100 hover:bg-yellow-200 text-yellow-900",
    ITP: "bg-green-100 hover:bg-green-200 text-green-900",
    Tuning: "bg-blue-100 hover:bg-blue-200 text-blue-900",
    viitor: "bg-purple-100 hover:bg-purple-200 text-purple-900",
    default: "bg-gray-100 hover:bg-gray-200 text-gray-900",
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <h2 className="text-2xl font-bold text-slate-700 mb-8 uppercase tracking-wide">
        Lista Cheltuielilor
      </h2>

      {categories.length === 0 ? (
        <p className="text-gray-400 italic">Nicio cheltuială încă</p>
      ) : (
        <div className="flex flex-col gap-5 w-full max-w-md">
          {categories.map((category) => {
            const total = grouped[category].total;
            const colorClass =
              categoryColors[category] || categoryColors.default;

            return (
              <button
                key={category}
                onClick={() => {
                  const url = `/category/${category.toLowerCase()}`;
                  console.log("🔗 Navighez către:", url);
                  navigate(url);
                }}
                className={`
                  ${colorClass}
                  rounded-full py-5 w-full font-semibold
                  text-center shadow-[0_8px_20px_rgba(0,0,0,0.3)]
                  hover:shadow-[0_10px_25px_rgba(59,130,246,0.5)]
                  hover:-translate-y-[2px]
                  transition-all duration-300
                  flex flex-col items-center justify-center
                  bg-gradient-to-b from-[#3b82f6] to-[#2563eb]
                  border border-blue-400/40
                  backdrop-blur-xl
                `}
              >
                <span className="text-lg font-semibold text-white drop-shadow-md">
                  {t(category)}
                </span>
                <span className="text-sm text-blue-100 mt-1">{total} lei</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
