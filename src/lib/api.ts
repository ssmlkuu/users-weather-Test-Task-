import type { RandomUser, CurrentWeather } from "./types";

/** Нормализация randomuser.me → наш RandomUser */
function normalizeUsers(results: any[]): RandomUser[] {
  return results.map((u: any) => ({
    id: u.login?.uuid,
    name: `${u.name?.first ?? ""} ${u.name?.last ?? ""}`.trim(),
    gender: (u.gender ?? "other") as RandomUser["gender"],
    email: u.email,
    picture: u.picture?.large ?? u.picture?.medium ?? u.picture?.thumbnail,
    location: {
      country: u.location?.country ?? "",
      city: u.location?.city ?? "",
      lat: parseFloat(u.location?.coordinates?.latitude ?? "0"),
      lon: parseFloat(u.location?.coordinates?.longitude ?? "0"),
    },
  }));
}

/** Список пользователей */
export async function getUsers(page = 1, results = 12): Promise<RandomUser[]> {
  const url = new URL("https://randomuser.me/api/");
  url.searchParams.set("results", String(results));
  url.searchParams.set("page", String(page));
  // Берём только нужные поля, чтобы ответ был легче
  url.searchParams.set(
    "inc",
    "login,name,gender,email,picture,location"
  );
  url.searchParams.set("noinfo", "1");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch users");
  const data = await res.json();
  return normalizeUsers(data.results ?? []);
}

/** Текущая погода + min/max на сегодня по часовым данным */
export async function getWeather(lat: number, lon: number): Promise<CurrentWeather> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current_weather", "true");
  url.searchParams.set("hourly", "temperature_2m");
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch weather");
  const data = await res.json();

  const code: number = data?.current_weather?.weathercode ?? 0;
  const temp: number = data?.current_weather?.temperature ?? 0;

  // вычисляем «сегодня» в таймзоне ответа
  const tz: string = data?.timezone ?? "UTC";
  const todayISO = new Date()
    .toLocaleString("sv-SE", { timeZone: tz }) // 2025-10-25 14:05:00
    .slice(0, 10); // YYYY-MM-DD

  const times: string[] = data?.hourly?.time ?? [];
  const temps: number[] = data?.hourly?.temperature_2m ?? [];

  let min = temp;
  let max = temp;

  if (times.length && temps.length) {
    const todayTemps: number[] = times
      .map((t: string, i: number) => (t.startsWith(todayISO) ? temps[i] : undefined))
      .filter((v: number | undefined): v is number => typeof v === "number");

    if (todayTemps.length) {
      min = Math.min(...todayTemps);
      max = Math.max(...todayTemps);
    }
  }

  return { code, temp, min, max };
}

export interface HourlyToday {
  times: string[];      // ISO строки часов за сегодня в timezone API
  temps: number[];      // температуры по тем же индексам
  timezone: string;     // удобен для форматирования
}

export async function getWeatherHourlyToday(lat: number, lon: number): Promise<HourlyToday> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("hourly", "temperature_2m");
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch hourly weather");
  const data = await res.json();

  const tz: string = data?.timezone ?? "UTC";
  const times: string[] = data?.hourly?.time ?? [];
  const temps: number[] = data?.hourly?.temperature_2m ?? [];

  const todayISO = new Date()
    .toLocaleString("sv-SE", { timeZone: tz }) // YYYY-MM-DD HH:mm:ss
    .slice(0, 10); // YYYY-MM-DD

  const todayTimes: string[] = [];
  const todayTemps: number[] = [];
  for (let i = 0; i < times.length; i++) {
    if (times[i]?.startsWith(todayISO)) {
      todayTimes.push(times[i]);
      todayTemps.push(temps[i]);
    }
  }

  return { times: todayTimes, temps: todayTemps, timezone: tz };
}