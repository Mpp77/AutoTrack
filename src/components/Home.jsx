import { useNavigate } from "react-router-dom";
import { PieChart, List, Plus, Settings, AlertTriangle, Droplet, CheckCircle, Calendar, Bell } from "lucide-react";import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import "../App.css";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Folosim state pentru a putea actualiza imaginea și numărul imediat ce vin de pe server
  const [carPlate, setCarPlate] = useState(localStorage.getItem("carPlate") || t("auto", "Auto"));
  const [carImage, setCarImage] = useState(localStorage.getItem("carImage"));
  const [reminders, setReminders] = useState([]);
  
  // O variabilă care ne anunță când serverul a terminat de trimis datele
  const [cloudDataLoaded, setCloudDataLoaded] = useState(false);

  // 1. La începutul componentei tale Home(), adaugă această stare:
const [showTalon, setShowTalon] = useState(false);

  useEffect(() => {
    const fetchCloudSettings = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const API_URL = "https://autotrack-hxdk.onrender.com/api";

      try {
        const response = await fetch(`${API_URL}/user-settings`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          console.log("DATE PRIMITE DE LA SERVER:", data);

          if (data) {
            localStorage.setItem("carPlate", data.car_plate || "");
            localStorage.setItem("carImage", data.car_image || "");
            localStorage.setItem("currency", data.currency || "RON");
            localStorage.setItem("itpDate", data.itp_date || "");
            localStorage.setItem("insuranceDate", data.insurance_date || "");
            localStorage.setItem("oilExpiryDate", data.oil_date || "");
            localStorage.setItem("targetKm", data.target_km || "");
            localStorage.setItem("roadTollDate", data.road_toll_date || "");
            localStorage.setItem("licenseDate", data.license_date || "");

            localStorage.setItem("carModel", data.car_model || "");
            localStorage.setItem("vin", data.vin || "");
            localStorage.setItem("engineCode", data.engine_code || "");
            localStorage.setItem("carYear", data.car_year || "");
            localStorage.setItem("engineSize", data.engine_size || "");
            localStorage.setItem("hp", data.hp || "");
            localStorage.setItem("tyres", data.tyres || "");

            setCarPlate(data.car_plate || t("auto", "Auto"));
            setCarImage(data.car_image || null);
            setCloudDataLoaded(true);
          }
        }
      } catch (error) {
        console.error("Eroare la descărcarea setărilor:", error);
      }
    };

    fetchCloudSettings();
  }, []);

  // 2. Efectul care CALCULEAZĂ Reminderele (se rulează din nou după ce cloudDataLoaded devine true)
  useEffect(() => {
    const calculateReminders = () => {
      const activeReminders = [];
      const today = new Date();
      
      // ITP
      const savedItp = localStorage.getItem("itpDate");
      if (savedItp) {
        const diff = Math.ceil((new Date(savedItp) - today) / (1000 * 60 * 60 * 24));
        if (diff <= 30 && diff > 10) {
          activeReminders.push({ id: 'itp', type: "info", text: `${t("itpIn", "ITP:")} ${diff} ${t("daysLeft", "zile rămase")}` });
        } else if (diff <= 10 && diff > 0) {
          activeReminders.push({ id: 'itp', type: "warning", text: `${t("itpIn", "ITP:")} ${diff} ${t("daysLeft", "zile rămase")}` });
        } else if (diff <= 0) {
          activeReminders.push({ id: 'itp', type: "warning", text: t("itpExpired", "ITP EXPIRAT!") });
        }
      }

      // RCA
      const savedRca = localStorage.getItem("insuranceDate");
      if (savedRca) {
        const diffRca = Math.ceil((new Date(savedRca) - today) / (1000 * 60 * 60 * 24));
        if (diffRca <= 30 && diffRca > 10) {
          activeReminders.push({ id: 'rca', type: "info", text: `${t("rcaIn", "RCA:")} ${diffRca} ${t("daysLeft", "zile rămase")}` });
        } else if (diffRca <= 10 && diffRca > 0) {
          activeReminders.push({ id: 'rca', type: "warning", text: `${t("rcaIn", "RCA:")} ${diffRca} ${t("daysLeft", "zile rămase")}` });
        } else if (diffRca <= 0) {
          activeReminders.push({ id: 'rca', type: "warning", text: t("rcaExpired", "RCA EXPIRAT!") });
        }
      }

//Rovinieta
const savedRoadToll = localStorage.getItem("roadTollDate");
if (savedRoadToll) {
  const diffRoadToll = Math.ceil((new Date(savedRoadToll) - today) / (1000 * 60 * 60 * 24));
  
  if (diffRoadToll <= 30 && diffRoadToll > 10) {
    activeReminders.push({ 
      id: 'roadToll', 
      type: "info", 
      text: `${t("roadTollIn", "Rovinietă:")} ${diffRoadToll} ${t("daysLeft", "zile rămase")}` 
    });
  } else if (diffRoadToll <= 10 && diffRoadToll > 0) {
    activeReminders.push({ 
      id: 'roadToll', 
      type: "warning", 
      text: `${t("roadTollIn", "Rovinietă:")} ${diffRoadToll} ${t("daysLeft", "zile rămase")}` 
    });
  } else if (diffRoadToll <= 0) {
    activeReminders.push({ 
      id: 'roadToll', 
      type: "warning", 
      text: t("roadTollExpired", "ROVINIETĂ EXPIRATĂ!") 
    });
  }
}

      // ULEI - CALCUL KM
      const targetKm = localStorage.getItem("targetKm");
      if (targetKm) {
        activeReminders.push({ 
          id: 'oil-km', 
          type: "info", 
          icon: <Droplet size={18} />, 
          text: `${t("serviceAt", "Revizie la:")} ${targetKm} km` 
        });
      }

      // ULEI - CALCUL DATĂ
      const oilExpiryDate = localStorage.getItem("oilExpiryDate");
      if (oilExpiryDate) {
        const diffOil = Math.ceil((new Date(oilExpiryDate) - today) / (1000 * 60 * 60 * 24));
        if (diffOil <= 30 && diffOil > 10) {
          activeReminders.push({ id: 'oil-date', type: "info", icon: <Calendar size={18} />, text: `${t("oilChangeIn", "Schimb ulei în:")} ${diffOil} ${t("days", "zile")}` });
        } else if (diffOil <= 10 && diffOil > 0) {
          activeReminders.push({ id: 'oil-date', type: "warning", icon: <Calendar size={18} />, text: `${t("oilChangeIn", "Schimb ulei în:")} ${diffOil} ${t("days", "zile")}` });
        } else if (diffOil <= 0) {
          activeReminders.push({ id: 'oil-date', type: "warning", icon: <Calendar size={18} />, text: t("oilChangeExpired", "Schimb ulei EXPIRAT!") });
        }
      }

      setReminders(activeReminders);
    };

    calculateReminders();
  }, [t, cloudDataLoaded]); // Array de dependențe: se re-rulează dacă vin date noi din cloud

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="home-page">
      <button onClick={handleLogout} className="logout-btn">
        ← {t("logout", "Ieșire")}
      </button>

      <button onClick={() => navigate("/settings")} className="settings-btn">
        <Settings size={22} />
      </button>

      <div className="dashboard-central">
        
        <h2 className="dashboard-greeting">
          {t("status", "Status")} <span className="highlight">{carPlate}</span>
        </h2>

        <div 
          className="progress-ring-container clickable-ring" 
          onClick={() => navigate("/settings")}
          title={t("changePhoto")}
        >
          <div className="car-icon-center">
            {carImage ? (
              <img src={carImage} alt="Car" className="custom-car-photo" />
            ) : (
              <NeonCarIcon />
            )}
          </div>
        </div>
        
        <div className="smart-badges-container">
          {reminders.length > 0 ? (
            reminders.map((rem) => (
              <div 
                key={rem.id} 
                className={`smart-badge badge-${rem.type} clickable-badge`}
                onClick={() => navigate("/reminders")} 
                title={t("updateAlert", "Actualizează alerta")}
              >
                {rem.icon || <AlertTriangle size={18} />}
                <span>{rem.text}</span>
              </div>
            ))
          ) : (
            <div 
              className="smart-badge badge-success clickable-badge"
              onClick={() => navigate("/reminders")}
            >
              <CheckCircle size={18} />
              <span>{t("nothingToDo", "Nimic de făcut")}</span>
            </div>
          )}
        </div>
      </div>

{/* ÎNTREGUL POP-UP VECHI DE TALON A FOST ELIMINAT DE AICI */}
     
      {/* Cele două butoane separate aliniate perfect stânga-dreapta */}
      <div className="home-action-row">
        <button className="edit-reminders-link" onClick={() => navigate("/reminders")}>
          <Bell size={14} style={{ marginRight: '6px' }} />
          <span>{t("configureAlertsShort", "Alerte")}</span>
        </button>

        {/* Butonul de Talon acum trimite direct către pagina dedicată /talon */}
        <button className="edit-reminders-link" onClick={() => navigate("/talon")}>
          <span>🪪 Talon</span>
        </button>
      </div>

      {/* Navigația de jos */}
      <nav className="bottom-nav">
        <button onClick={() => navigate("/overview")}>
          <PieChart />
          <span>{t("overview", "Rapoarte")}</span>
        </button>
        <button onClick={() => navigate("/add-expense")}>
          <Plus />
          <span>{t("addExpenseShort", "Adaugă")}</span>
        </button>
        <button onClick={() => navigate("/expenses")}>
          <List />
          <span>{t("expenseList", "Lista")}</span>
        </button>
      </nav>
    </div>
  );
}

function NeonCarIcon() {
  return (
    <svg viewBox="0 0 140 120" className="neon-svg-center">
      <path d="M30 70l14-22h50l17 22h7c8 0 13 6 13 14v10H14V84c0-8 6-14 14-14z" />
      <path d="M50 52h18v18H38zM74 52h18l14 18H74z" />
      <circle cx="42" cy="94" r="10" />
      <circle cx="100" cy="94" r="10" />
      <path d="M58 88h28" />
      <circle cx="94" cy="34" r="22" />
      <path d="M84 44l20-20M85 27h.1M103 41h.1" />
    </svg>
  );
}
