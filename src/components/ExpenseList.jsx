import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useTranslation } from "react-i18next";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="text-white">
      {expenses.length === 0 ? (
        <p className="text-gray-400">{t("noData")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {expenses.map((exp) => (
            <li
              key={exp.id}
              className="bg-[#0d1a2f]/70 border border-[#1e3a8a] rounded-lg p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{t(exp.category)}</p>
                {exp.note && (
                  <p className="text-xs text-gray-400">{exp.note}</p>
                )}
              </div>
              <p className="font-medium text-blue-300">
                {exp.amount} {t("currency")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}