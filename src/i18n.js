import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ro from "./locales/ro.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ro: { translation: ro },
    },
    lng: localStorage.getItem("language") || "en", // 🔹 limba curentă la pornire
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

// 🔹 actualizează automat localStorage când se schimbă limba
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18n;