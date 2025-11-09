import { useState, useEffect } from "react";

// Mapping of country codes to emergency numbers
const EMERGENCY_NUMBERS: Record<string, string> = {
  US: "911", // United States
  CA: "911", // Canada
  GB: "999", // United Kingdom
  AU: "000", // Australia
  NZ: "111", // New Zealand
  IN: "112", // India (also 100, 101, 102)
  DE: "112", // Germany
  FR: "112", // France
  IT: "112", // Italy
  ES: "112", // Spain
  NL: "112", // Netherlands
  BE: "112", // Belgium
  AT: "112", // Austria
  CH: "112", // Switzerland
  SE: "112", // Sweden
  NO: "112", // Norway
  DK: "112", // Denmark
  FI: "112", // Finland
  PL: "112", // Poland
  PT: "112", // Portugal
  GR: "112", // Greece
  IE: "112", // Ireland
  JP: "110", // Japan (police) / 119 (fire/ambulance)
  CN: "110", // China (police) / 119 (fire) / 120 (ambulance)
  KR: "112", // South Korea
  BR: "192", // Brazil (ambulance) / 190 (police) / 193 (fire)
  MX: "911", // Mexico
  AR: "911", // Argentina
  ZA: "10111", // South Africa
  EG: "122", // Egypt
  NG: "199", // Nigeria
  KE: "999", // Kenya
  AE: "999", // UAE
  SA: "997", // Saudi Arabia
  TR: "112", // Turkey
  RU: "112", // Russia
  IL: "101", // Israel (police) / 100 (fire) / 102 (ambulance)
  PK: "15", // Pakistan (police) / 16 (fire) / 115 (ambulance)
  BD: "999", // Bangladesh
  PH: "911", // Philippines
  TH: "191", // Thailand
  VN: "113", // Vietnam
  ID: "112", // Indonesia
  MY: "999", // Malaysia
  SG: "995", // Singapore (ambulance) / 999 (police)
};

// Default emergency number if country not found
const DEFAULT_EMERGENCY_NUMBER = "911";

export const useEmergencyNumber = () => {
  const [emergencyNumber, setEmergencyNumber] = useState<string>(DEFAULT_EMERGENCY_NUMBER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        // Try to get country from IP-based geolocation (no permission needed)
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        
        if (data.country_code) {
          const countryCode = data.country_code.toUpperCase();
          const number = EMERGENCY_NUMBERS[countryCode] || DEFAULT_EMERGENCY_NUMBER;
          setEmergencyNumber(number);
          setLoading(false);
          return; // Exit early if successful
        }
      } catch (error) {
        console.error("Error fetching country code from IP:", error);
      }

      // Fallback: try browser geolocation
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Use OpenWeather API if available (similar to AQI page)
              const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
              if (apiKey) {
                const geoRes = await fetch(
                  `https://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&limit=1&appid=${apiKey}`
                );
                const geo = await geoRes.json();
                const countryCode = geo?.[0]?.country?.toUpperCase();
                if (countryCode) {
                  const number = EMERGENCY_NUMBERS[countryCode] || DEFAULT_EMERGENCY_NUMBER;
                  setEmergencyNumber(number);
                }
              }
            } catch (error) {
              console.error("Error fetching country from geolocation:", error);
            } finally {
              setLoading(false);
            }
          },
          () => {
            // Geolocation failed, use default
            setLoading(false);
          },
          { timeout: 5000 }
        );
      } else {
        // No geolocation support, use default
        setLoading(false);
      }
    };

    fetchCountryCode();
  }, []);

  return { emergencyNumber, loading };
};

