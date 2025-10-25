import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getWeather, getWeatherHourlyToday } from "../lib/api";
import { useWeatherCodes } from "../hooks/useWeatherCodes";

interface Props {
  open: boolean;
  onClose: () => void;
  lat: number;
  lon: number;
  title?: string;
}

export default function WeatherModal({ open, onClose, lat, lon, title }: Props) {
  // Esc — закрыть
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Блокируем скролл боди
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const { data: summary, isLoading: sumLoading, isError: sumError } = useQuery({
    queryKey: ["weather-summary", lat, lon],
    queryFn: () => getWeather(lat, lon),
    enabled: open,
    refetchInterval: open ? 300_000 : false,
    refetchOnWindowFocus: true,
  });

  const { data: hourly, isLoading: hrLoading, isError: hrError } = useQuery({
    queryKey: ["weather-hourly", lat, lon],
    queryFn: () => getWeatherHourlyToday(lat, lon),
    enabled: open,
    refetchInterval: open ? 300_000 : false,
    refetchOnWindowFocus: true,
  });

  const codes = useWeatherCodes();
  if (!open) return null;

  const label = summary ? codes[summary.code]?.label ?? "Weather" : "Weather";
  const Icon = codes[summary?.code ?? 3]?.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-[overlay-in_160ms_ease-out_forwards]"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-lg rounded-3xl bg-white/90 backdrop-blur-xl
                   ring-1 ring-gray-200 shadow-xl animate-[modal-in_220ms_ease-out_both]"
      >

        <div className="flex items-center justify-between px-5 py-4">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              {title ?? "Weather details"}
            </div>
            <h3 className="truncate text-xl font-semibold text-gray-900">{label}</h3>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-full
                       border border-gray-200 text-gray-600 hover:bg-gray-100"
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-5 pb-5">

          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3
                          ring-1 ring-gray-100 shadow-inner">
            {Icon && <Icon size={22} className="shrink-0 text-gray-700" />}
            {sumLoading ? (
              <span className="text-sm text-gray-500">Loading summary…</span>
            ) : sumError || !summary ? (
              <span className="text-sm text-red-600">Failed to load summary.</span>
            ) : (
              <div className="flex flex-col leading-tight">
                <div className="text-2xl font-semibold tracking-tight text-gray-900">
                  {Math.round(summary.temp)}°C
                </div>
                <div className="text-xs text-gray-500">
                  min {Math.round(summary.min)}° / max {Math.round(summary.max)}°
                </div>
              </div>
            )}
          </div>

          <div className="max-h-64 overflow-auto rounded-2xl ring-1 ring-gray-100">
            {hrLoading ? (
              <div className="p-3 text-sm text-gray-500">Loading hourly…</div>
            ) : hrError || !hourly ? (
              <div className="p-3 text-sm text-red-600">Failed to load hourly.</div>
            ) : hourly.times.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">No hourly data for today.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {hourly.times.map((t, i) => {
                  const hhmm = t.slice(11, 16);
                  const temp = Math.round(hourly.temps[i]);
                  return (
                    <li
                      key={t}
                      className="flex items-center justify-between px-4 py-2 text-sm
                                 transition-colors hover:bg-gray-50"
                    >
                      <span className="font-medium tabular-nums text-gray-800">{hhmm}</span>
                      <span className="tabular-nums text-gray-700">{temp}°C</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
