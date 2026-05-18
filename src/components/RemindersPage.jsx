import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bell, Calendar, Gauge } from "lucide-react";
import "../App.css";

export default function RemindersPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [itpDate, setItpDate] = useState(localStorage.getItem("itpDate") || "");
  const [insuranceDate, setInsuranceDate] = useState(localStorage.getItem("insuranceDate") || "");
  const [roadTollDate, setRoadTollDate] = useState(localStorage.getItem("roadTollDate") || "");
  
  // ADAUGĂ STAREA PENTRU PERMIS
  const [licenseDate, setLicenseDate] = useState(localStorage.getItem("licenseDate") || "");
  
  const [lastChangeKm, setLastChangeKm] = useState(localStorage.getItem("lastChangeKm") || "");
  const [intervalKm, setIntervalKm] = useState(localStorage.getItem("intervalKm") || "");
  const [lastChangeDate, setLastChangeDate] = useState(localStorage.getItem("lastChangeDate") || "");

  const handleSave = async () => {
    localStorage.setItem("itpDate", itpDate);
    localStorage.setItem("insuranceDate", insuranceDate);
    localStorage.setItem("roadTollDate", roadTollDate);
    localStorage.setItem("licenseDate", licenseDate);
    localStorage.setItem("lastChangeKm", lastChangeKm);
    localStorage.setItem("intervalKm", intervalKm);
    localStorage.setItem("lastChangeDate", lastChangeDate);
  
    let calculatedTargetKm = "";
    if (lastChangeKm && intervalKm) {
      calculatedTargetKm = (parseInt(lastChangeKm) + parseInt(intervalKm)).toString();
      localStorage.setItem("targetKm", calculatedTargetKm);
    } else {
      localStorage.removeItem("targetKm");
    }
  
    if (lastChangeDate) {
      const date = new Date(lastChangeDate);
      date.setFullYear(date.getFullYear() + 1);
      localStorage.setItem("oilExpiryDate", date.toISOString());
    } else {
      localStorage.removeItem("oilExpiryDate");
    }
  
    const token = localStorage.getItem("token");
    if (token) {
      const API_URL = "https://autotrack-hxdk.onrender.com/api";
      try {
        const response = await fetch(`${API_URL}/user-settings`, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            itpDate: itpDate,
            insuranceDate: insuranceDate,
            roadTollDate: roadTollDate,
            licenseDate: licenseDate,
            oil_date: lastChangeDate,         
            target_km: calculatedTargetKm,
            lastChangeKm: lastChangeKm, 
            intervalKm: intervalKm      
          })
        });
  
        if (response.ok) {
          alert(t("remindersSaved", "Remindere salvate cu succes!"));
          navigate("/home");
        } else {
          console.error("Eroare la salvarea alertelor pe server");
        }
      } catch (error) {
        console.error("Eroare de rețea la salvarea alertelor:", error);
      }
    }
  };

  return (
    <div className="settings-page">
      <button onClick={() => navigate("/home")} className="back-home-btn">
        ← {t("back", "Înapoi")}
      </button>

      <div className="settings-card">
        <h1>{t("maintenance", "Mentenanță")}</h1>

        <div className="settings-row">
          <label><Calendar size={18} /> {t("itpExpiryDate", "Data Expirare ITP")}</label>
          <input 
            type="date" 
            className="filter-input" 
            value={itpDate} 
            onChange={(e) => setItpDate(e.target.value)} 
            autoComplete="off"
            inputMode="none"
          />
        </div>

        <div className="settings-row">
          <label><Bell size={18} /> {t("insuranceExpiryDate", "Data Expirare Asigurare")}</label>
          <input 
            type="date" 
            className="filter-input" 
            value={insuranceDate} 
            onChange={(e) => setInsuranceDate(e.target.value)} 
            autoComplete="off"
            inputMode="none"
          />
        </div>

        <div className="settings-row">
          <label><Bell size={18} /> {t("roadTollExpiryDate", "Data Expirare Rovinietă")}</label>
          <input 
            type="date" 
            className="filter-input" 
            value={roadTollDate} 
            onChange={(e) => setRoadTollDate(e.target.value)} 
            autoComplete="off"
            inputMode="none"
          />
        </div>

        {/* SECȚIUNEA NOUĂ PENTRU PERMIS DE CONDUCERE */}
        <div className="settings-row">
          <label><Calendar size={18} /> {t("licenseExpiryDate", "Data Expirare Permis Conducere")}</label>
          <input 
            type="date" 
            className="filter-input" 
            value={licenseDate} 
            onChange={(e) => setLicenseDate(e.target.value)} 
            autoComplete="off"
            inputMode="none"
          />
        </div>

        <div className="settings-row">
          <label><Gauge size={18} /> {t("oilChangeDetails", "Detalii Schimb Ulei")}</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input 
              type="number" 
              placeholder={t("lastOilChangeKm", "Km la ultimul schimb (ex: 260000)")}
              className="filter-input" 
              value={lastChangeKm} 
              onChange={(e) => setLastChangeKm(e.target.value)} 
            />
            <input 
              type="number" 
              placeholder={t("oilChangeInterval", "Interval (peste câți km? ex: 15000)")}
              className="filter-input" 
              value={intervalKm} 
              onChange={(e) => setIntervalKm(e.target.value)} 
            />
            <label style={{ fontSize: '14px', marginTop: '5px' }}>{t("lastOilChangeDate", "Data ultimului schimb:")}</label>
            <input 
              type="date" 
              className="filter-input" 
              value={lastChangeDate} 
              onChange={(e) => setLastChangeDate(e.target.value)} 
              autoComplete="off"
              inputMode="none"
            />
          </div>
        </div>

        <button onClick={handleSave} className="save-btn-neon">
          {t("saveConfig", "Salvează Configurația")}
        </button>
      </div>
    </div>
  );
}