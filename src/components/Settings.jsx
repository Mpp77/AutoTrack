import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Camera, Type, Globe, Coins } from "lucide-react";
import "../App.css";

export default function Settings() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // --- SETĂRILE TALE VECHI (Monedă) ---
  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "RON"
  );

  const handleCurrencyChange = (e) => {
    const value = e.target.value;
    setCurrency(value);
    localStorage.setItem("currency", value);
  };

  // --- SETĂRILE NOI (Mașină) ---
  const [carPlate, setCarPlate] = useState(localStorage.getItem("carPlate") || "");
  const [carImage, setCarImage] = useState(localStorage.getItem("carImage") || "");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCarImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem("carPlate", carPlate);
    if (carImage) {
      localStorage.setItem("carImage", carImage);
    }
    // Funcția ta veche schimba moneda/limba instant, 
    // deci butonul ăsta doar salvează noile date despre mașină și te întoarce pe Home.
    alert(t("remindersSaved", "Setări salvate cu succes!"));
    navigate("/home");
  };

  return (
    <div className="settings-page">
      <button onClick={() => navigate("/home")} className="back-home-btn">
        ← {t("backHome", "Înapoi")}
      </button>

      <div className="settings-card">
        <h1>{t("settings", "Setări Profil")}</h1>

        {/* 1. SETARE LIMBĂ */}
        <div className="settings-row">
          <label>
            <Globe size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> 
            {t("language", "Limbă")}
          </label>
          <select
            className="filter-input"
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="ro">Română</option>
          </select>
        </div>

        {/* 2. SETARE MONEDĂ */}
        <div className="settings-row">
          <label>
            <Coins size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> 
            {t("currencySettings", "Monedă")}
          </label>
          <select 
            className="filter-input" 
            value={currency} 
            onChange={handleCurrencyChange}
          >
            <option value="RON">RON - Lei</option>
            <option value="EUR">EUR - €</option>
          </select>
        </div>

        {/* 3. SETARE NUMĂR ÎNMATRICULARE */}
        <div className="settings-row">
          <label>
            <Type size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> 
            {t("carPlate", "Număr Înmatriculare")}
          </label>
          <input 
            type="text" 
            className="filter-input" 
            placeholder="Ex: TM 99 ABC" 
            value={carPlate} 
            onChange={(e) => setCarPlate(e.target.value.toUpperCase())}
          />
        </div>

        {/* 4. SETARE POZĂ MAȘINĂ */}
        <div className="settings-row">
          <label>
            <Camera size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> 
            {t("carPhoto", "Poză Mașină (Opțional)")}
          </label>
          <input 
            type="file" 
            accept="image/*" 
            className="filter-input" 
            onChange={handleImageUpload} 
            style={{ padding: "12px", cursor: "pointer", height: "auto", minHeight: "52px" }}
          />
          {carImage && (
            <img 
              src={carImage} 
              alt="Preview" 
              className="settings-photo-preview"
            />
          )}
        </div>

        {/* BUTON SALVARE */}
        <button onClick={handleSave} className="save-btn-neon">
          {t("saveConfig", "Salvează Configurația")}
        </button>
      </div>
    </div>
  );
}