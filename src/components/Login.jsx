import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import "../App.css";

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isCreatingAccount) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: serverTimestamp(),
        });

        setMessage("✅ " + t("accountCreated"));
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("✅ " + t("loggedIn"));
        navigate("/dashboard");
      }

      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage("❌ " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#030b18] via-[#081a36] to-[#0f294e]">
      <div className="relative bg-[#0b1320]/80 backdrop-blur-xl shadow-[0_0_35px_rgba(0,180,255,0.2)] rounded-3xl px-10 py-10 text-center w-[400px] border border-[#1e3a8a]/60 flex flex-col items-center transition-all duration-300 hover:shadow-[0_0_45px_rgba(0,180,255,0.4)]">
        
        {/* Selectare limbă */}
        <div className="flex justify-end w-full mb-4 gap-2">
          <button
            onClick={() => i18n.changeLanguage("en")}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold transition-all duration-300 ${
              i18n.language === "en"
                ? "bg-gradient-to-r from-[#007bff] to-[#00bfff] text-white shadow-md"
                : "bg-[#0d1a2f]/70 text-gray-300 hover:text-white border border-[#1e3a8a]"
            }`}
          >
            🇬🇧 EN
          </button>
          <button
            onClick={() => i18n.changeLanguage("ro")}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold transition-all duration-300 ${
              i18n.language === "ro"
                ? "bg-gradient-to-r from-[#007bff] to-[#00bfff] text-white shadow-md"
                : "bg-[#0d1a2f]/70 text-gray-300 hover:text-white border border-[#1e3a8a]"
            }`}
          >
            🇷🇴 RO
          </button>
        </div>
  
        {/* Titlu */}
        <h1
          className="text-5xl font-extrabold mb-4 tracking-wide"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            background: "linear-gradient(to right, #00bfff, #007bff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 20px rgba(0,191,255,0.3)",
          }}
        >
          AutoTrack
        </h1>
  
        <h2 className="text-gray-200 text-lg font-semibold mb-6">
          {isCreatingAccount ? t("createAccount") : t("signIn")}
        </h2>
  
        {/* Formular */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="email"
            placeholder={t("emailAddress")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#0d1a2f]/80 border border-[#1e3a8a]/80 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bfff]/70 transition-all"
          />
          <input
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#0d1a2f]/80 border border-[#1e3a8a]/80 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bfff]/70 transition-all"
          />
  
          <button
            type="submit"
            className="bg-gradient-to-r from-[#007bff] to-[#00bfff] text-white font-semibold py-3 rounded-md shadow-lg hover:shadow-[0_0_20px_rgba(0,191,255,0.6)] hover:scale-[1.03] transition-transform tracking-wide"
          >
            {isCreatingAccount ? t("createAccount") : t("signIn")}
          </button>
        </form>
  
        <p
          onClick={() => setIsCreatingAccount(!isCreatingAccount)}
          className="text-[#00bfff] hover:underline cursor-pointer mt-6 text-sm tracking-wide"
        >
          {isCreatingAccount ? t("alreadyHaveAccount") : t("noAccount")}
        </p>
  
        {message && (
          <p className="text-green-400 mt-4 text-sm tracking-wide">{message}</p>
        )}
  
        {/* Efect decorativ */}
        <div className="absolute -z-10 inset-0 rounded-3xl bg-gradient-to-br from-[#007bff]/10 to-[#00bfff]/5 blur-3xl"></div>
      </div>
    </div>
  );
  
}
