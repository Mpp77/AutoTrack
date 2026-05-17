import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../App.css";

export default function TalonPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Încărcăm stările din localStorage
  const [carModel, setCarModel] = useState(localStorage.getItem("carModel") || "");
  const [vin, setVin] = useState(localStorage.getItem("vin") || "");
  const [engineCode, setEngineCode] = useState(localStorage.getItem("engineCode") || "");
  const [carYear, setCarYear] = useState(localStorage.getItem("carYear") || "");
  const [engineSize, setEngineSize] = useState(localStorage.getItem("engineSize") || "");
  const [hp, setHp] = useState(localStorage.getItem("hp") || "");
  const [tyres, setTyres] = useState(localStorage.getItem("tyres") || "");

  const handleSave = async () => {
    // 1. Salvăm mai întâi local ca să se vadă instant
    localStorage.setItem("carModel", carModel);
    localStorage.setItem("vin", vin);
    localStorage.setItem("engineCode", engineCode);
    localStorage.setItem("carYear", carYear);
    localStorage.setItem("engineSize", engineSize);
    localStorage.setItem("hp", hp);
    localStorage.setItem("tyres", tyres);
    
    // 2. Trimitem datele către serverul tău din cloud
    const token = localStorage.getItem("token");
    if (token) {
      const API_URL = "https://autotrack-hxdk.onrender.com/api";
      try {
        const response = await fetch(`${API_URL}/user-settings`, {
          method: "POST", // sau PUT, în funcție de cum e configurat backend-ul tău pentru update
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            // Trimitem cheile exact în formatul pe care îl așteaptă baza ta de date (snake_case sau camelCase)
            car_model: carModel,
            vin: vin,
            engine_code: engineCode,
            car_year: carYear,
            engine_size: engineSize,
            hp: hp,
            tyres: tyres
          })
        });

        if (!response.ok) {
          console.error("Serverul a returnat o eroare la salvarea talonului");
        }
      } catch (error) {
        console.error("Eroare la conexiunea cu serverul pentru talon:", error);
      }
    }
    
    alert(t("talonSaved", "Datele talonului au fost salvate cu succes!"));
    navigate("/home");
  };

  return (
    <div className="settings-page">
      <button onClick={() => navigate("/home")} className="back-home-btn">
        ← {t("back", "Înapoi")}
      </button>

      <div className="digital-talon-card page-version">
        <div className="talon-header">
          <span className="talon-country">RO</span>
          <div className="talon-title-box">
            <h3>{t("digitalTalonTitle", "TALON DIGITAL AUTO")}</h3>
            <p>{t("digitalTalonSub", "SPECIFICAȚII TEHNICE MAȘINĂ")}</p>
          </div>
        </div>
        
        <div className="talon-body">
          <div className="talon-row">
            <span className="talon-label">{t("talonPlate", "A. Nr. înmatriculare:")}</span>
            <strong className="talon-value-neon">{localStorage.getItem("carPlate") || "TM 14 MXP"}</strong>
          </div>
          
          <div className="talon-row">
            <span className="talon-label">{t("talonModel", "D.1. Marcă / Model:")}</span>
            <input 
              type="text" 
              className="talon-input-field" 
              value={carModel} 
              onChange={(e) => setCarModel(e.target.value)}
              placeholder="ex: Volkswagen Golf 6"
            />
          </div>

          <div className="talon-row">
            <span className="talon-label">{t("talonVin", "E. Serie șasiu (VIN):")}</span>
            <input 
              type="text" 
              className="talon-input-field vin-text" 
              value={vin} 
              onChange={(e) => setVin(e.target.value)}
              placeholder="ex: WVWZZZ1KZAMXXXXXX"
              maxLength={17}
            />
          </div>

          <div className="talon-grid">
            <div className="talon-row">
              <span className="talon-label">{t("talonEngineSize", "P.1. Capacitate (Motor):")}</span>
              <input 
                type="text" 
                className="talon-input-field" 
                value={engineSize} 
                onChange={(e) => setEngineSize(e.target.value)}
                placeholder="ex: 2.0 TDI"
              />
            </div>
            <div className="talon-row">
              <span className="talon-label">{t("talonHp", "P.2. Putere (CP):")}</span>
              <input 
                type="number" 
                className="talon-input-field" 
                value={hp} 
                onChange={(e) => setHp(e.target.value)}
                placeholder="ex: 140"
              />
            </div>
          </div>

          <div className="talon-grid">
            <div className="talon-row">
              <span className="talon-label">{t("talonEngineCode", "P.5. Cod Motor:")}</span>
              <input 
                type="text" 
                className="talon-input-field" 
                value={engineCode} 
                onChange={(e) => setEngineCode(e.target.value)}
                placeholder="ex: CAXA"
              />
            </div>
            <div className="talon-row">
              <span className="talon-label">{t("talonYear", "B. An Fabr:")}</span>
              <input 
                type="number" 
                className="talon-input-field" 
                value={carYear} 
                onChange={(e) => setCarYear(e.target.value)}
                placeholder="ex: 2010"
              />
            </div>
          </div>

          <div className="talon-row">
            <span className="talon-label">{t("talonTyres", "L. Anvelope / Cauciucuri:")}</span>
            <input 
              type="text" 
              className="talon-input-field" 
              value={tyres} 
              onChange={(e) => setTyres(e.target.value)}
              placeholder="ex: 225/45 R17 / 205/55 R16"
            />
          </div>

          <button onClick={handleSave} className="save-btn-neon" style={{ marginTop: '24px', width: '100%' }}>
            {t("saveConfig", "Salvează Configurația")}
          </button>
        </div>
      </div>
    </div>
  );
}