import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../App.css";

export default function Settings() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "RON"
  );

  const handleCurrencyChange = (e) => {
    const value = e.target.value;
    setCurrency(value);
    localStorage.setItem("currency", value);
  };

  return (
    <div className="settings-page">
      <button onClick={() => navigate("/home")} className="back-home-btn">
        ← {t("backHome")}
      </button>

      <div className="settings-card">
      <h1>{t("settings")}</h1>

        <div className="settings-row">
        <label>{t("language")}</label>
              <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="ro">Română</option>
          </select>
        </div>

        <div className="settings-row">
        <label>{t("currencySettings")}</label>
                  <select value={currency} onChange={handleCurrencyChange}>
            <option value="RON">RON - Lei</option>
            <option value="EUR">EUR - €</option>
          </select>
        </div>
      </div>
    </div>
  );
}