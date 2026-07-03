import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Camera, Type, Globe, Coins, Car } from "lucide-react";
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

  const [carPlate, setCarPlate] = useState(localStorage.getItem("carPlate") || "");
  const [carImage, setCarImage] = useState(localStorage.getItem("carImage") || "");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        
        const MAX_WIDTH = 400; 
        const scaleSize = MAX_WIDTH / img.width;
        
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        
        setCarImage(compressedBase64); 
      };
    };
  };

  const handleSave = async () => {
    // Întâi salvăm datele local, pentru ca pagina să le citească super rapid
    localStorage.setItem("carPlate", carPlate);
    if (carImage) {
      localStorage.setItem("carImage", carImage);
    }
    localStorage.setItem("currency", currency);

    // ACUM TRIMITEM TOTUL CĂTRE SERVER:
    const token = localStorage.getItem("token");
    const API_URL = "https://autotrack-hxdk.onrender.com/api"; 

    // Împachetăm toate setările
    const settingsData = {
      carPlate: carPlate, 
      carImage: carImage, 
      currency: currency,
      itpDate: localStorage.getItem("itpDate"),
      insuranceDate: localStorage.getItem("insuranceDate"),
      oilDate: localStorage.getItem("oilExpiryDate"),
      targetKm: localStorage.getItem("targetKm")
    };

    try {
      const response = await fetch(`${API_URL}/user-settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(settingsData)
      });

      if (response.ok) {
        alert("Setări salvate cu succes pe server!");
      } else {
        alert("Am salvat local, dar a apărut o eroare la salvarea în cloud.");
      }
    } catch (error) {
      console.error("Eroare de rețea:", error);
      alert("Eroare de rețea. Datele s-au salvat doar local.");
    }
  };

  const handleRemoveImage = () => {
    if (window.confirm(t("confirmDeletePhoto", "Sigur vrei să ștergi poza mașinii?"))) {
      setCarImage(""); 
      localStorage.removeItem("carImage"); 
    }
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
            <Car size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> 
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
  
  {/* Containerul pentru noul buton de încărcare */}
  <label className="custom-file-upload">
    <input 
      type="file" 
      accept="image/*" 
      onChange={handleImageUpload} 
      style={{ display: 'none' }} 
    />
    <span>{t("chooseFile", "Alege poza")}</span>
  </label>
  
  {carImage && (
    <div style={{ textAlign: 'center', marginTop: '15px' }}>
      <img 
        src={carImage} 
        alt="Preview" 
        className="settings-photo-preview"
        style={{ marginBottom: '10px' }}
      />
      <button 
        onClick={handleRemoveImage}
        className="remove-photo-btn"
      >
        {t("removePhoto", "Șterge poza")}
      </button>
    </div>
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