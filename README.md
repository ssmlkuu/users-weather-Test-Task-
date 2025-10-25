# Users + Weather (React + Vite + TS)

Приложение из тестового задания: список случайных пользователей + погода по их локации, сохранение пользователей и просмотр сохранённых.

## ✨ Основное

* **FE:** React 18 + Vite + TypeScript
* **Стили:** Tailwind CSS v4
* **Данные:** randomuser.me (пользователи), open-meteo.com (погода)
* **Стейт/запросы:** @tanstack/react-query v5
* **Роутинг:** react-router-dom v6

## ✅ Что реализовано по ТЗ

* Маршрут **`/`** — карточки пользователей (Name, Gender, Image, Location, Email)
* В каждой карточке **Weather**: иконка (Sunny/Cloudy/…), Current/Min/Max за сегодня
* Кнопка **Save** — сохраняет пользователя (localStorage)
* Кнопка **Refresh** — обновляет карточки пользователей.
* Кнопка **Weather** — модалка с подробной погодой (в `/saved`; опционально можно включить и на `/`)
* **Load more** — подгружает дополнительные страницы без перезаписи предыдущих
* Маршрут **`/saved`** — сохранённые пользователи, карточки без кнопки Save, с Weather и Remove, Clear all

## 🎁 Бонусы (реализовано)

* Автообновление текущей температуры каждые **5 минут** (бейдж + модалка)
* Адаптивная сетка (мобильные/планшеты/десктоп)

## 🧭 Что **не** делала из бонусов (по желанию)

* Next.js API routes (проект на чистом React)
* Хранение не в localStorage (можно легко добавить мини-бэк/SQLite)

---

## 🗂️ Структура проекта

```
src/
  components/
    Header.tsx
    UserCard.tsx
    WeatherBadge.tsx
    WeatherModal.tsx
    Spinner.tsx
  hooks/
    useSavedUsers.ts
    useWeatherCodes.ts
  lib/
    api.ts
    types.ts
  routes/
    Home.tsx
    Saved.tsx
  App.tsx
  main.tsx
  index.css
```

## ⚙️ Установка и запуск

```bash
npm i
npm run dev
# http://localhost:5173
```

## 🔌 API и важные детали

* **Users:** `https://randomuser.me/api/?results=12&page=1&inc=login,name,gender,email,picture,location&noinfo=1`
* **Weather:** `https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current_weather=true&hourly=temperature_2m&timezone=auto`
* Рассчёт **min/max** — на стороне клиента по `hourly.temperature_2m` за текущую дату таймзоны ответа.
* Маппинг `weathercode → { label, icon }` — в `useWeatherCodes.ts`.

## 🧠 Архитектурные заметки

* `useInfiniteQuery` для «Load more» (страницы накапливаются)
* `useSavedUsers` хранит данные в `localStorage` (ключ `saved-users-v1`), снапшот как строка — без ложных апдейтов
* Модалка блокирует скролл боди, закрывается по Esc/overlay, есть автообновление

## 🚀 Деплой

### Vercel

 https://users-weather-test-task.vercel.app/

### Пример секции «AI usage» для README

> В процессе использовалась AI-помощь для планирования архитектуры, уточнения ошибок и ревью. Продукционный код писался вручную, вся функциональность проверена вручную.
