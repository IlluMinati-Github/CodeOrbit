import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Wind, MapPin, AlertTriangle, Loader2, LocateFixed, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AirQualityData = {
  aqiIndex: number; // 1-5 from OpenWeather
  components: {
    pm2_5?: number;
    pm10?: number;
    o3?: number;
    no2?: number;
    so2?: number;
    co?: number;
  };
};

type CategorySummary = {
  label: string;
  ringClass: string;
  textClass: string;
  aqi?: number;
  aqiType: "US" | "India";
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }
  return fallback;
};

const AQI = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>("");
  const [air, setAir] = useState<AirQualityData | null>(null);
  const [manualCity, setManualCity] = useState("");
  const [country, setCountry] = useState<string>("");

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY as string | undefined;

  const fetchAQIByCoords = useCallback(async (lat: number, lon: number) => {
    try {
      if (!apiKey) {
        throw new Error("Missing OpenWeather API key. Set VITE_OPENWEATHER_API_KEY in .env");
      }

      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
      );
      const geo = (await geoRes.json()) as Array<{ name?: string; state?: string; country?: string }>;
      const name = geo?.[0]?.name;
      const state = geo?.[0]?.state;
      const countryCode = geo?.[0]?.country || "";
      setCountry(countryCode);
      setCity([name, state, countryCode].filter(Boolean).join(", "));

      const airRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );
      const airJson = (await airRes.json()) as {
        list?: Array<{ main: { aqi: number }; components?: AirQualityData["components"] }>;
      };
      const item = airJson?.list?.[0];
      if (!item) throw new Error("No AQI data available for your location");

      setAir({
        aqiIndex: item.main.aqi,
        components: item.components ?? {},
      });
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Failed to fetch AQI"));
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const fetchAQIByCityName = useCallback(async (name: string) => {
    setLoading(true);
    setError(null);
    setAir(null);
    try {
      if (!apiKey) throw new Error("Missing OpenWeather API key");
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(name)}&limit=1&appid=${apiKey}`
      );
      const geos = (await geoRes.json()) as Array<{
        name?: string;
        state?: string;
        country?: string;
        lat: number;
        lon: number;
      }>;
      const first = geos?.[0];
      if (!first) throw new Error("City not found");
      const countryCode = first.country || "";
      setCountry(countryCode);
      const label = [first.name, first.state, countryCode].filter(Boolean).join(", ");
      setCity(label);
      await fetchAQIByCoords(first.lat, first.lon);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Failed to fetch city AQI"));
      setLoading(false);
    }
  }, [apiKey, fetchAQIByCoords]);

  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    setAir(null);
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported in this browser");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchAQIByCoords(latitude, longitude);
      },
      (err) => {
        setError(
          err?.code === err.PERMISSION_DENIED
            ? "Location permission denied. Please allow location access."
            : "Unable to get your location"
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, [fetchAQIByCoords]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const category = useMemo<CategorySummary>(() => {
    const defaultCategory: CategorySummary = {
      label: "-",
      ringClass: "bg-muted",
      textClass: "text-muted-foreground",
      aqiType: "US",
    };

    if (!air) {
      return defaultCategory;
    }

    const isIndia = country === "IN";

    function computeSubIndex(Cp: number, breakpoints: Array<{ Clow: number; Chigh: number; Ilow: number; Ihigh: number }>) {
      for (const bp of breakpoints) {
        if (Cp >= bp.Clow && Cp <= bp.Chigh) {
          return Math.round(((bp.Ihigh - bp.Ilow) / (bp.Chigh - bp.Clow)) * (Cp - bp.Clow) + bp.Ilow);
        }
      }
      return undefined;
    }

    function usAqiFromComponents(components?: AirQualityData["components"]) {
      if (!components) return undefined;
      const pm25 = components.pm2_5;
      const pm10 = components.pm10;

      const pm25Breaks = [
        { Clow: 0.0, Chigh: 12.0, Ilow: 0, Ihigh: 50 },
        { Clow: 12.1, Chigh: 35.4, Ilow: 51, Ihigh: 100 },
        { Clow: 35.5, Chigh: 55.4, Ilow: 101, Ihigh: 150 },
        { Clow: 55.5, Chigh: 150.4, Ilow: 151, Ihigh: 200 },
        { Clow: 150.5, Chigh: 250.4, Ilow: 201, Ihigh: 300 },
        { Clow: 250.5, Chigh: 350.4, Ilow: 301, Ihigh: 400 },
        { Clow: 350.5, Chigh: 500.4, Ilow: 401, Ihigh: 500 },
      ];

      const pm10Breaks = [
        { Clow: 0, Chigh: 54, Ilow: 0, Ihigh: 50 },
        { Clow: 55, Chigh: 154, Ilow: 51, Ihigh: 100 },
        { Clow: 155, Chigh: 254, Ilow: 101, Ihigh: 150 },
        { Clow: 255, Chigh: 354, Ilow: 151, Ihigh: 200 },
        { Clow: 355, Chigh: 424, Ilow: 201, Ihigh: 300 },
        { Clow: 425, Chigh: 504, Ilow: 301, Ihigh: 400 },
        { Clow: 505, Chigh: 604, Ilow: 401, Ihigh: 500 },
      ];

      const subIdx: number[] = [];
      if (typeof pm25 === "number") {
        const s = computeSubIndex(pm25, pm25Breaks);
        if (typeof s === "number") subIdx.push(s);
      }
      if (typeof pm10 === "number") {
        const s = computeSubIndex(pm10, pm10Breaks);
        if (typeof s === "number") subIdx.push(s);
      }
      if (subIdx.length === 0) return undefined;
      return Math.max(...subIdx);
    }

    function indiaAqiFromComponents(components?: AirQualityData["components"]) {
      if (!components) return undefined;
      const pm25 = components.pm2_5;
      const pm10 = components.pm10;

      // Indian AQI breakpoints for PM2.5 (μg/m³)
      const pm25Breaks = [
        { Clow: 0.0, Chigh: 30.0, Ilow: 0, Ihigh: 50 },
        { Clow: 31.0, Chigh: 60.0, Ilow: 51, Ihigh: 100 },
        { Clow: 61.0, Chigh: 90.0, Ilow: 101, Ihigh: 200 },
        { Clow: 91.0, Chigh: 120.0, Ilow: 201, Ihigh: 300 },
        { Clow: 121.0, Chigh: 250.0, Ilow: 301, Ihigh: 400 },
        { Clow: 250.1, Chigh: 500.0, Ilow: 401, Ihigh: 500 },
      ];

      // Indian AQI breakpoints for PM10 (μg/m³)
      const pm10Breaks = [
        { Clow: 0, Chigh: 50, Ilow: 0, Ihigh: 50 },
        { Clow: 51, Chigh: 100, Ilow: 51, Ihigh: 100 },
        { Clow: 101, Chigh: 250, Ilow: 101, Ihigh: 200 },
        { Clow: 251, Chigh: 350, Ilow: 201, Ihigh: 300 },
        { Clow: 351, Chigh: 430, Ilow: 301, Ihigh: 400 },
        { Clow: 431, Chigh: 500, Ilow: 401, Ihigh: 500 },
      ];

      const subIdx: number[] = [];
      if (typeof pm25 === "number") {
        const s = computeSubIndex(pm25, pm25Breaks);
        if (typeof s === "number") subIdx.push(s);
      }
      if (typeof pm10 === "number") {
        const s = computeSubIndex(pm10, pm10Breaks);
        if (typeof s === "number") subIdx.push(s);
      }
      if (subIdx.length === 0) return undefined;
      return Math.max(...subIdx);
    }

    const aqi = isIndia ? indiaAqiFromComponents(air?.components) : usAqiFromComponents(air?.components);

    function labelForAqi(val?: number, isIndia: boolean) {
      if (val == null) return "-";
      if (isIndia) {
        if (val <= 50) return "Good";
        if (val <= 100) return "Satisfactory";
        if (val <= 200) return "Moderate";
        if (val <= 300) return "Poor";
        if (val <= 400) return "Very Poor";
        return "Severe";
      } else {
        if (val <= 50) return "Good";
        if (val <= 100) return "Moderate";
        if (val <= 150) return "Unhealthy for Sensitive Groups";
        if (val <= 200) return "Unhealthy";
        if (val <= 300) return "Very Unhealthy";
        return "Hazardous";
      }
    }

    function colorForAqi(val?: number, isIndia: boolean) {
      if (val == null) return { ringClass: "bg-muted", textClass: "text-muted-foreground" };
      if (isIndia) {
        if (val <= 50) return { ringClass: "bg-green-500/20", textClass: "text-green-600" };
        if (val <= 100) return { ringClass: "bg-yellow-500/20", textClass: "text-yellow-600" };
        if (val <= 200) return { ringClass: "bg-orange-500/20", textClass: "text-orange-600" };
        if (val <= 300) return { ringClass: "bg-red-500/20", textClass: "text-red-600" };
        if (val <= 400) return { ringClass: "bg-red-600/20", textClass: "text-red-700" };
        return { ringClass: "bg-rose-700/20", textClass: "text-rose-700" };
      } else {
        if (val <= 50) return { ringClass: "bg-green-500/20", textClass: "text-green-600" };
        if (val <= 100) return { ringClass: "bg-yellow-500/20", textClass: "text-yellow-600" };
        if (val <= 150) return { ringClass: "bg-orange-500/20", textClass: "text-orange-600" };
        if (val <= 200) return { ringClass: "bg-red-500/20", textClass: "text-red-600" };
        if (val <= 300) return { ringClass: "bg-purple-500/20", textClass: "text-purple-600" };
        return { ringClass: "bg-rose-700/20", textClass: "text-rose-700" };
      }
    }

    const colors = colorForAqi(aqi, isIndia);
    return {
      label: labelForAqi(aqi, isIndia),
      ringClass: colors.ringClass,
      textClass: colors.textClass,
      aqi,
      aqiType: isIndia ? "India" : "US",
    };
  }, [air, country]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 md:ml-64 pt-16 md:pt-6">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold">Air Quality Monitor</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">Track air quality in your area</p>
          </div>

          <Card className="card-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Current Air Quality</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {city || (loading ? "Detecting location..." : "Unknown location")}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-[13px]" onClick={requestLocation} disabled={loading}>
                    <LocateFixed className="h-4 w-4 mr-1" /> Use location
                  </Button>
                  <Wind className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Fetching live AQI...</p>
                  </div>
                ) : error ? (
                  <div>
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                ) : (
                  <>
                    <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${category.ringClass}`}>
                      <div className={`text-4xl font-bold ${category.textClass}`}>{category.aqi ?? "-"}</div>
                    </div>
                    <div>
                      <p className={`text-xl font-semibold ${category.textClass}`}>{category.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{category.aqiType} AQI (0–500)</p>
                    </div>
                    {/* AQI Scale with Traffic Light Theme */}
                    {category.aqi !== undefined && (
                      <div className="mt-6 w-full max-w-md mx-auto">
                        <div className="relative h-10 rounded-full overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
                          {/* Scale segments - Traffic Light Theme */}
                          <div className="absolute inset-0 flex">
                            <div className="flex-1 bg-green-500"></div>
                            <div className="flex-1 bg-yellow-500"></div>
                            <div className="flex-1 bg-orange-500"></div>
                            <div className="flex-1 bg-red-500"></div>
                            <div className="flex-1 bg-red-600"></div>
                            <div className="flex-1 bg-rose-700"></div>
                          </div>
                          {/* Pointer */}
                          <div
                            className="absolute top-0 bottom-0 z-20 transition-all duration-500 ease-out"
                            style={{
                              left: `${Math.min(100, Math.max(0, (category.aqi / 500) * 100))}%`,
                              transform: "translateX(-50%)",
                            }}
                          >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[12px] border-l-transparent border-r-transparent border-b-gray-900 dark:border-b-gray-100"></div>
                            <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-1 h-full bg-gray-900 dark:bg-gray-100"></div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 dark:bg-gray-100 rounded-full border-2 border-white dark:border-gray-800 shadow-md"></div>
                          </div>
                        </div>
                        {/* Scale labels */}
                        <div className="flex justify-between mt-3 text-xs text-muted-foreground font-medium">
                          <span>0</span>
                          <span>100</span>
                          <span>200</span>
                          <span>300</span>
                          <span>400</span>
                          <span>500</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter city (e.g., Mumbai, IN)"
                    className="pl-10 rounded-[13px]"
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                  />
                </div>
                <Button
                  className="rounded-[13px]"
                  onClick={() => manualCity && fetchAQIByCityName(manualCity)}
                  disabled={!manualCity || loading}
                >
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="card-soft">
            <CardHeader>
              <CardTitle>Pollutant Levels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : error ? (
                <div className="text-sm text-muted-foreground">No data</div>
              ) : (
                <>
                  <div className="flex justify-between items-center p-3 rounded-[13px] bg-muted/50">
                    <span className="font-medium">PM2.5</span>
                    <span className="text-sm">{air?.components.pm2_5 ?? "-"} μg/m³</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-[13px] bg-muted/50">
                    <span className="font-medium">PM10</span>
                    <span className="text-sm">{air?.components.pm10 ?? "-"} μg/m³</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-[13px] bg-muted/50">
                    <span className="font-medium">O₃ (Ozone)</span>
                    <span className="text-sm">{air?.components.o3 ?? "-"} μg/m³</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-[13px] bg-muted/50">
                    <span className="font-medium">NO₂</span>
                    <span className="text-sm">{air?.components.no2 ?? "-"} μg/m³</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-[13px] bg-muted/50">
                    <span className="font-medium">SO₂</span>
                    <span className="text-sm">{air?.components.so2 ?? "-"} μg/m³</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-[13px] bg-muted/50">
                    <span className="font-medium">CO</span>
                    <span className="text-sm">{air?.components.co ?? "-"} μg/m³</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className={`card-soft ${
            error
              ? "bg-destructive/5 border-destructive/20"
              : category.label === "Good"
              ? "bg-green-500/5 border-green-500/20"
              : category.label === "Satisfactory" || category.label === "Moderate"
              ? category.aqiType === "India" && category.label === "Moderate"
                ? "bg-orange-500/5 border-orange-500/20"
                : "bg-yellow-500/5 border-yellow-500/20"
              : category.label === "Unhealthy for Sensitive Groups"
              ? "bg-orange-500/5 border-orange-500/20"
              : category.label === "Poor" || category.label === "Unhealthy"
              ? "bg-red-500/5 border-red-500/20"
              : category.label === "Very Poor" || category.label === "Very Unhealthy"
              ? "bg-red-600/5 border-red-600/20"
              : "bg-rose-700/5 border-rose-700/20"
          }`}>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${error ? "text-destructive" : category.textClass}`} />
                <div>
                  <h3 className={`font-medium mb-1 ${error ? "text-destructive" : category.textClass}`}>Health Recommendations</h3>
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Fetching recommendations...</p>
                  ) : error ? (
                    <p className="text-sm text-muted-foreground">Enable location to see local recommendations.</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {category.label === "Good"
                        ? "Air quality is satisfactory. Enjoy outdoor activities."
                        : category.label === "Satisfactory"
                        ? "Acceptable; some risk for sensitive groups."
                        : category.label === "Moderate"
                        ? category.aqiType === "India"
                          ? "Sensitive groups should limit prolonged outdoor exertion."
                          : "Acceptable; some risk for sensitive groups."
                        : category.label === "Unhealthy for Sensitive Groups"
                        ? "Sensitive groups should limit prolonged outdoor exertion."
                        : category.label === "Poor" || category.label === "Unhealthy"
                        ? "Everyone may experience health effects; reduce outdoor exertion."
                        : category.label === "Very Poor" || category.label === "Very Unhealthy"
                        ? "Health alert: avoid outdoor activities; consider PM-rated mask."
                        : "Hazardous: stay indoors with filtered air; avoid outdoor exposure."}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AQI;
