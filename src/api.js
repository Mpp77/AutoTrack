export const API_URL = "https://autotrack-hxdk.onrender.com/api";

export const fetchCurrentExchangeRate = async () => {
  try {
    const res = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json");
    if (!res.ok) throw new Error("Nu s-a putut prelua cursul valutar");
    
    const data = await res.json();
    return data.eur.ron; 
  } catch (error) {
    console.error("Eroare la cursul valutar în timp real:", error);
    return 4.97; 
  }
};