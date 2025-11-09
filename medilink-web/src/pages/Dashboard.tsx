import { useState, useCallback, useEffect, useMemo } from "react";
import { Upload, AlertTriangle, Calendar, Activity, Wind, Loader2, CheckCircle2, XCircle, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/Sidebar";
import { analyzeSymptoms } from "@/services/symptomChecker";
import { toast } from "sonner";

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

const Dashboard = () => {
  const medicines = [
    { name: "Amoxicillin", dosage: "500mg", frequency: "3x daily", warning: null },
    { name: "Ibuprofen", dosage: "400mg", frequency: "2x daily", warning: "Take with food" },
    { name: "Metformin", dosage: "850mg", frequency: "2x daily", warning: null },
  ];

  const [symptomInput, setSymptomInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    possibleConditions: string[];
    recommendations: string[];
    severity: 'mild' | 'moderate' | 'severe';
    advice: string;
  } | null>(null);

  // AQI State
  const [aqiLoading, setAqiLoading] = useState(true);
  const [aqiError, setAqiError] = useState<string | null>(null);
  const [aqiCity, setAqiCity] = useState<string>("");
  const [aqiAir, setAqiAir] = useState<AirQualityData | null>(null);
  const [aqiCountry, setAqiCountry] = useState<string>("");

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
      setAqiCountry(countryCode);
      setAqiCity([name, state, countryCode].filter(Boolean).join(", "));

      const airRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );
      const airJson = (await airRes.json()) as {
        list?: Array<{ main: { aqi: number }; components?: AirQualityData["components"] }>;
      };
      const item = airJson?.list?.[0];
      if (!item) throw new Error("No AQI data available for your location");

      setAqiAir({
        aqiIndex: item.main.aqi,
        components: item.components ?? {},
      });
      setAqiError(null);
    } catch (error: unknown) {
      setAqiError(getErrorMessage(error, "Failed to fetch AQI"));
    } finally {
      setAqiLoading(false);
    }
  }, [apiKey]);

  const requestLocation = useCallback(() => {
    setAqiLoading(true);
    setAqiError(null);
    setAqiAir(null);
    if (!("geolocation" in navigator)) {
      setAqiError("Geolocation not supported in this browser");
      setAqiLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchAQIByCoords(latitude, longitude);
      },
      (err) => {
        setAqiError(
          err?.code === err.PERMISSION_DENIED
            ? "Location permission denied. Please allow location access."
            : "Unable to get your location"
        );
        setAqiLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, [fetchAQIByCoords]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const aqiCategory = useMemo<CategorySummary>(() => {
    const defaultCategory: CategorySummary = {
      label: "-",
      ringClass: "bg-muted",
      textClass: "text-muted-foreground",
      aqiType: "US",
    };

    if (!aqiAir) {
      return defaultCategory;
    }

    const isIndia = aqiCountry === "IN";

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

      const pm25Breaks = [
        { Clow: 0.0, Chigh: 30.0, Ilow: 0, Ihigh: 50 },
        { Clow: 31.0, Chigh: 60.0, Ilow: 51, Ihigh: 100 },
        { Clow: 61.0, Chigh: 90.0, Ilow: 101, Ihigh: 200 },
        { Clow: 91.0, Chigh: 120.0, Ilow: 201, Ihigh: 300 },
        { Clow: 121.0, Chigh: 250.0, Ilow: 301, Ihigh: 400 },
        { Clow: 250.1, Chigh: 500.0, Ilow: 401, Ihigh: 500 },
      ];

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

    const aqi = isIndia ? indiaAqiFromComponents(aqiAir?.components) : usAqiFromComponents(aqiAir?.components);

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
  }, [aqiAir, aqiCountry]);

  const handleAnalyzeSymptoms = async () => {
    if (!symptomInput.trim()) {
      toast.error("Please describe your symptoms");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeSymptoms(symptomInput);
      setAnalysisResult(result);
      toast.success("Symptom analysis completed");
    } catch (error: any) {
      console.error("Error analyzing symptoms:", error);
      toast.error(error.message || "Failed to analyze symptoms. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 overflow-auto md:ml-64">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pt-16 md:pt-8">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground">Welcome back! Here's your health overview.</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <Card className="card-soft card-hover border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Prescriptions
                </CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold">3</div>
              </CardContent>
            </Card>

            <Card className="card-soft card-hover border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Today's Reminders
                </CardTitle>
                <Calendar className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold">5</div>
              </CardContent>
            </Card>

            <Card className="card-soft card-hover border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Safety Alerts
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold">1</div>
              </CardContent>
            </Card>

            <Card className="card-soft card-hover border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  AQI Level
                </CardTitle>
                <Wind className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                {aqiLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">Loading...</div>
                  </div>
                ) : aqiError ? (
                  <div className="text-sm text-destructive">Error</div>
                ) : (
                  <div className={`text-3xl font-heading font-bold ${aqiCategory.textClass}`}>
                    {aqiCategory.label}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {/* Prescription Upload */}
            <Card className="card-soft border-0">
              <CardHeader>
                <CardTitle className="font-heading">Upload Prescription</CardTitle>
                <CardDescription>
                  Upload a photo or scan of your prescription for instant digitization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-[13px] p-12 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
                <Button className="btn-primary w-full">
                  Upload & Analyze
                </Button>
              </CardContent>
            </Card>

            {/* Active Medicines */}
            <Card className="card-soft border-0">
              <CardHeader>
                <CardTitle className="font-heading">Active Medicines</CardTitle>
                <CardDescription>
                  Current medications and their schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicines.map((medicine, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-[13px]"
                    >
                      <div>
                        <p className="font-medium">{medicine.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {medicine.dosage} • {medicine.frequency}
                        </p>
                      </div>
                      {medicine.warning && (
                        <Badge variant="destructive" className="rounded-[8px]">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {medicine.warning}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Symptom Checker */}
            <Card className="card-soft border-0">
              <CardHeader>
                <CardTitle className="font-heading">Symptom Checker</CardTitle>
                <CardDescription>
                  Describe your symptoms for preliminary insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="e.g., headache, fever, fatigue..."
                  className="rounded-[13px]"
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isAnalyzing) {
                      handleAnalyzeSymptoms();
                    }
                  }}
                  disabled={isAnalyzing}
                />
                <Button 
                  className="btn-secondary w-full"
                  onClick={handleAnalyzeSymptoms}
                  disabled={isAnalyzing || !symptomInput.trim()}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Symptoms"
                  )}
                </Button>

                {analysisResult && (
                  <div className="mt-4 space-y-4 p-4 bg-muted/50 rounded-[13px] border border-border">
                    {/* Severity Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Severity:</span>
                      <Badge
                        variant={
                          analysisResult.severity === "severe"
                            ? "destructive"
                            : analysisResult.severity === "moderate"
                            ? "default"
                            : "secondary"
                        }
                        className="rounded-[8px]"
                      >
                        {analysisResult.severity.charAt(0).toUpperCase() + analysisResult.severity.slice(1)}
                      </Badge>
                    </div>

                    <Separator />

                    {/* Possible Conditions */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">Possible Conditions:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
                        {analysisResult.possibleConditions.map((condition, index) => (
                          <li key={index}>{condition}</li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    {/* Recommendations */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-semibold">Recommendations:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
                        {analysisResult.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    {/* Advice */}
                    <div>
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          <XCircle className="h-4 w-4 text-destructive" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold block mb-1">Important Advice:</span>
                          <p className="text-sm text-muted-foreground">{analysisResult.advice}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground italic">
                        ⚠️ This is for informational purposes only. Always consult a healthcare professional for proper diagnosis.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AQI Widget */}
            <Card className="card-soft border-0">
              <CardHeader>
                <CardTitle className="font-heading">Air Quality Index</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {aqiCity || (aqiLoading ? "Detecting location..." : "Location unavailable")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {aqiLoading ? (
                  <div className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Fetching real-time AQI...</p>
                    </div>
                  </div>
                ) : aqiError ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
                    <p className="text-sm text-destructive mb-2">{aqiError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={requestLocation}
                      className="rounded-[13px]"
                    >
                      Retry
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${aqiCategory.ringClass} mb-4`}>
                      <div className={`text-4xl font-heading font-bold ${aqiCategory.textClass}`}>
                        {aqiCategory.aqi ?? "-"}
                      </div>
                    </div>
                    <p className={`text-lg font-medium mb-1 ${aqiCategory.textClass}`}>
                      {aqiCategory.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {aqiCategory.aqiType} AQI • {aqiCity ? `Updated for ${aqiCity.split(",")[0]}` : "Real-time data"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
