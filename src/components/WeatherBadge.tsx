import { useQuery } from "@tanstack/react-query";
import { getWeather } from "../lib/api";
import { useWeatherCodes } from "../hooks/useWeatherCodes";

export default function WeatherBadge({ lat, lon }: { lat: number; lon: number }) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["weather", lat, lon],
        queryFn: () => getWeather(lat, lon),
        refetchInterval: 300_000,    
        refetchOnWindowFocus: true,
        enabled: Number.isFinite(lat) && Number.isFinite(lon),
    });

  const codes = useWeatherCodes();

  if (isLoading)
    return <span className="text-xs text-gray-500">Loading weather…</span>;
  if (isError || !data)
    return <span className="text-xs text-red-600">Weather error</span>;

  const info = codes[data.code] ?? { label: "Unknown", icon: codes[3].icon };
  const Icon = info.icon;

    return (
    <div
        className="inline-flex items-center gap-2 rounded-full
                bg-gray-50 px-3 py-1.5 text-sm shadow-inner
                ring-1 ring-gray-100"
    >
        <Icon size={25} className="shrink-0" />
        <div className="flex flex-col leading-tight">
        <span className="font-medium">{info.label}</span>
        <span className="text-xs text-gray-500">
            {Math.round(data.temp)}°C · min {Math.round(data.min)}° / max {Math.round(data.max)}°
        </span>
        </div>
    </div>
    );
}
