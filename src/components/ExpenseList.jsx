import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(list);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-3">Recent Expenses</h2>
      {expenses.length === 0 ? (
        <p className="text-gray-400">No expenses yet</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {expenses.map((exp) => (
            <li
              key={exp.id}
              className="border rounded-xl p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{exp.category}</p>
                <p className="text-sm text-gray-500">{exp.note}</p>
              </div>
              <span className="font-semibold text-blue-600">
                {exp.amount} €
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
