import { useNavigate } from "react-router-dom";
import { PieChart, MonitorUp, List, Plus } from "lucide-react";
import "../App.css";
import { useTranslation } from "react-i18next";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="home-page">
      <button onClick={handleLogout} className="logout-btn">
      ← {t("logout")}
      </button>

      <section className="hero-card">
        <h1>{t("welcomeTitle")}</h1>
        <p>{t("welcomeSubtitle")}</p>

        <div className="icon-row">
          <NeonIcon type="report" />
          <NeonIcon type="chart" />
          <NeonIcon type="car" />
          <NeonIcon type="repair" />
        </div>
      </section>

      <nav className="bottom-nav">
        <button onClick={() => navigate("/overview")}>
          <PieChart />
          <span>{t("overview")}</span>
        </button>

        <button className="active" onClick={() => navigate("/add-expense")}>
          <Plus />
          <span>{t("addExpenseShort")}</span>
        </button>

        <button onClick={() => navigate("/expenses")}>
          <List />
          <span>{t("expenseList")}</span>
        </button>
      </nav>
    </div>
  );
}

function NeonIcon({ type }) {
  return (
    <div className="neon-circle">
      {type === "report" && (
        <svg viewBox="0 0 120 120" className="neon-svg">
          <path d="M34 22h42l14 14v62H34z" />
          <path d="M76 22v18h18" />
          <path d="M46 48h28M46 60h28M46 72h18" />
          <path d="M46 92V78M58 92V84M70 92V70" />
          <circle cx="88" cy="78" r="18" />
          <path d="M88 60v18l13 10" />
        </svg>
      )}

      {type === "chart" && (
        <MonitorUp strokeWidth={1.7} className="lucide-neon" />
      )}

      {type === "car" && (
        <svg viewBox="0 0 140 120" className="neon-svg car-svg">
          <path d="M30 70l14-22h50l17 22h7c8 0 13 6 13 14v10H14V84c0-8 6-14 14-14z" />
          <path d="M50 52h18v18H38zM74 52h18l14 18H74z" />
          <circle cx="42" cy="94" r="10" />
          <circle cx="100" cy="94" r="10" />
          <path d="M58 88h28" />
          <circle cx="94" cy="34" r="22" />
          <path d="M84 44l20-20M85 27h.1M103 41h.1" />
        </svg>
      )}

      {type === "repair" && (
        <svg viewBox="0 0 120 120" className="neon-svg">
          <path d="M28 30h64a6 6 0 0 1 6 6v48H36L28 94z" />
          <path d="M28 42h70" />
          <circle cx="42" cy="36" r="2" />
          <circle cx="54" cy="36" r="2" />
          <circle cx="66" cy="36" r="2" />
          <path d="M80 54l-26 26M55 54l25 25" />
          <path d="M34 98h22M38 88h14" />
        </svg>
      )}
    </div>
  );
}