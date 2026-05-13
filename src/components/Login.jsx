import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import "../App.css";

export default function Login({ initialCreateMode = false }) {
  const { t, i18n } = useTranslation();
    const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(initialCreateMode);
  const [isResetting, setIsResetting] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const endpoint = isResetting
        ? "reset-password"
        : isCreatingAccount
        ? "register"
        : "login";

      const res = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isResetting
            ? { email, newPassword: password }
            : { email, password }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      if (isResetting) {
        setMessage(`✅ ${t("passwordUpdated")}`);
        setIsResetting(false);
      } else if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/home");
        setMessage(
          isCreatingAccount
            ? `✅ ${t("accountCreated")}`
            : `✅ ${t("loggedIn")}`
        );
      }

      setEmail("");
      setPassword("");
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className={`auth-card ${isResetting ? "reset-mode" : ""}`}>

{!isResetting && (
  <div className="language-buttons">
    <button type="button" onClick={() => i18n.changeLanguage("en")}>
      🇬🇧 EN
    </button>

    <button type="button" onClick={() => i18n.changeLanguage("ro")}>
      🇷🇴 RO
    </button>
  </div>
)}

<img
  src="/icon-512.png"
  alt="AutoTrack logo"
  className="login-logo"
/>

        {isResetting && (
          <p className="auth-description">
            {t("resetPasswordDescription")}
          </p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder={t("emailAddress")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder={isResetting ? t("newPassword") : t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading
              ? t("loading")
              : isResetting
              ? t("resetPassword")
              : isCreatingAccount
              ? t("createAccount")
              : t("signIn")}
          </button>
        </form>

        {!isResetting ? (
          <>
            <p
              onClick={() => {
                setIsCreatingAccount(!isCreatingAccount);
                setIsResetting(false);
                setMessage("");
              }}
              className="auth-link"
            >
              {isCreatingAccount ? t("alreadyHaveAccount") : t("noAccount")}
            </p>

            <p
              onClick={() => {
                setIsResetting(true);
                setIsCreatingAccount(false);
                setMessage("");
                setEmail("");
                setPassword("");
              }}
              className="auth-link secondary"
            >
              {t("forgotPassword")}
            </p>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsResetting(false);
              setIsCreatingAccount(false);
              setMessage("");
              setEmail("");
              setPassword("");
            }}
            className="back-login-btn"
          >
            ← {t("backToSignIn")}
          </button>
        )}

        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}