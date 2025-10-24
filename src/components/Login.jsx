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
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [message, setMessage] = useState("");

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#031628] via-[#0a2242] to-[#142f5d]">
      <div className="bg-[#0b1320]/70 backdrop-blur-xl shadow-2xl rounded-3xl px-10 py-10 text-center w-[380px] border border-[#1e3a8a]/60 flex flex-col items-center">
        
        {/* 🌍 Bara de limbă sus în card */}
        <div className="flex justify-end w-full mb-3 gap-2">
  <button
    onClick={() => i18n.changeLanguage("en")}
    className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold transition-all duration-300 ${
      i18n.language === "en"
        ? "bg-gradient-to-r from-[#007bff] to-[#00bfff] text-white shadow-md"
        : "bg-[#0d1a2f]/80 text-gray-300 hover:text-white border border-[#1e3a8a]"
    }`}
  >
    🇬🇧 EN
  </button>
  <button
    onClick={() => i18n.changeLanguage("ro")}
    className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold transition-all duration-300 ${
      i18n.language === "ro"
        ? "bg-gradient-to-r from-[#007bff] to-[#00bfff] text-white shadow-md"
        : "bg-[#0d1a2f]/80 text-gray-300 hover:text-white border border-[#1e3a8a]"
    }`}
  >
    🇷🇴 RO
  </button>
</div>

        {/* Titlu aplicație */}
        <h1
          className="text-4xl font-extrabold mb-6 mt-3"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            background: "linear-gradient(to right, #007bff, #00bfff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          AutoTrack
        </h1>

        <h2 className="text-white text-xl font-semibold mb-6">
          {isCreatingAccount ? t("createAccount") : t("signIn")}
        </h2>

        {/* Formular login */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="email"
            placeholder={t("emailAddress")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#0d1a2f] border border-[#1e3a8a] text-white px-4 py-3 rounded-md focus:outline-none focus:border-[#007bff] transition-all"
          />
          <input
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#0d1a2f] border border-[#1e3a8a] text-white px-4 py-3 rounded-md focus:outline-none focus:border-[#007bff] transition-all"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-[#007bff] to-[#00bfff] text-white font-semibold py-2 rounded-md shadow-lg hover:scale-105 transition-transform"
          >
            {isCreatingAccount ? t("createAccount") : t("signIn")}
          </button>
        </form>

        <p
          onClick={() => setIsCreatingAccount(!isCreatingAccount)}
          className="text-[#00bfff] hover:underline cursor-pointer mt-4"
        >
          {isCreatingAccount ? t("alreadyHaveAccount") : t("noAccount")}
        </p>

        {message && <p className="text-green-400 mt-4">{message}</p>}
      </div>
    </div>
  );
}
