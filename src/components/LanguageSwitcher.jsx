import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  const currentLang = i18n.language || "en";

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "30px",
        display: "flex",
        gap: "10px",
        zIndex: 99999,
        width: "auto",
      }}
    >
      <button
        onClick={() => changeLanguage("en")}
        style={{
          padding: "6px 14px",
          borderRadius: "8px",
          fontWeight: "600",
          fontSize: "14px",
          cursor: "pointer",
          background:
            currentLang === "en"
              ? "linear-gradient(90deg, #007bff, #00bfff)"
              : "rgba(255, 255, 255, 0.1)",
          color: currentLang === "en" ? "#fff" : "#ccc",
          border: "1px solid rgba(0, 191, 255, 0.4)",
          boxShadow:
            currentLang === "en"
              ? "0 0 10px rgba(0, 191, 255, 0.6)"
              : "none",
          transition: "all 0.3s ease",
        }}
      >
        EN
      </button>

      <button
        onClick={() => changeLanguage("ro")}
        style={{
          padding: "6px 14px",
          borderRadius: "8px",
          fontWeight: "600",
          fontSize: "14px",
          cursor: "pointer",
          background:
            currentLang === "ro"
              ? "linear-gradient(90deg, #007bff, #00bfff)"
              : "rgba(255, 255, 255, 0.1)",
          color: currentLang === "ro" ? "#fff" : "#ccc",
          border: "1px solid rgba(0, 191, 255, 0.4)",
          boxShadow:
            currentLang === "ro"
              ? "0 0 10px rgba(0, 191, 255, 0.6)"
              : "none",
          transition: "all 0.3s ease",
        }}
      >
        RO
      </button>
    </div>
  );
}
