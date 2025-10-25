import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
} from "lucide-react";

export interface WeatherInfo {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

/** Маппинг open-meteo weathercode → label + icon */
export function useWeatherCodes(): Record<number, WeatherInfo> {
  return {
    0: { label: "Clear", icon: Sun },
    1: { label: "Mainly clear", icon: CloudSun },
    2: { label: "Partly cloudy", icon: CloudSun },
    3: { label: "Overcast", icon: Cloud },
    45: { label: "Fog", icon: CloudFog },
    48: { label: "Depositing rime fog", icon: CloudFog },
    51: { label: "Light drizzle", icon: CloudRain },
    53: { label: "Moderate drizzle", icon: CloudRain },
    55: { label: "Dense drizzle", icon: CloudRain },
    61: { label: "Slight rain", icon: CloudRain },
    63: { label: "Moderate rain", icon: CloudRain },
    65: { label: "Heavy rain", icon: CloudRain },
    71: { label: "Slight snow", icon: CloudSnow },
    73: { label: "Moderate snow", icon: CloudSnow },
    75: { label: "Heavy snow", icon: CloudSnow },
    77: { label: "Snow grains", icon: CloudSnow },
    80: { label: "Rain showers", icon: CloudRain },
    81: { label: "Heavy rain showers", icon: CloudRain },
    82: { label: "Violent rain showers", icon: CloudRain },
    85: { label: "Snow showers", icon: CloudSnow },
    86: { label: "Heavy snow showers", icon: CloudSnow },
    95: { label: "Thunderstorm", icon: CloudLightning },
    96: { label: "Thunderstorm (hail)", icon: CloudLightning },
    99: { label: "Thunderstorm (heavy hail)", icon: CloudLightning },
  };
}
