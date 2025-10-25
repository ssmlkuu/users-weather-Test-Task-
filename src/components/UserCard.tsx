import type { RandomUser } from "../lib/types";
import WeatherBadge from "./WeatherBadge";

export default function UserCard({
  user,
  onSave,
  onWeather,
  onRemove,
}: {
  user: RandomUser;
  onSave?: (u: RandomUser) => void;
  onWeather?: (u: RandomUser) => void;
  onRemove?: (id: string) => void;
}) {
  return (
    <div
      className="group will-change-transform animate-[fade-in_240ms_ease-out_both]
                 flex flex-col rounded-2xl bg-white p-5
                 ring-1 ring-gray-100 shadow-sm transition-all duration-200 ease-out
                 hover:scale-[1.01] hover:shadow-lg hover:ring-gray-200"
    >
      {/* верх: аватар + инфо */}
      <div className="flex items-center gap-4">
        <img
          src={user.picture}
          alt={user.name}
          className="h-20 w-20 rounded-full object-cover ring-1 ring-gray-200"
          loading="lazy"
          decoding="async"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="truncate text-lg font-semibold">{user.name}</h3>
            <span className="text-xs uppercase tracking-wide text-gray-500">
              {user.gender}
            </span>
          </div>
          <div className="mt-1 truncate text-sm text-gray-600">
            {user.location.city}, {user.location.country}
          </div>
          <div className="truncate text-sm text-gray-600">{user.email}</div>
        </div>
      </div>

      <div className="mt-3">
        <WeatherBadge lat={user.location.lat} lon={user.location.lon} />
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {onWeather && (
          <button
            onClick={() => onWeather(user)}
            className="cursor-pointer rounded-md border border-gray-200 bg-white px-4 py-2
                       text-sm font-medium text-gray-700 shadow-sm transition-all
                       hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-100 hover:shadow-md
                       active:translate-y-0 active:shadow-sm"
          >
            Weather
          </button>
        )}

        {onSave && (
          <button
            onClick={() => onSave(user)}
            className="cursor-pointer rounded-md border border-gray-200 bg-white px-4 py-2
                       text-sm font-medium text-gray-700 shadow-sm transition-all
                       hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-100 hover:shadow-md
                       active:translate-y-0 active:shadow-sm"
          >
            Save
          </button>
        )}

        {onRemove && (
          <button
            onClick={() => onRemove(user.id)}
            className="cursor-pointer rounded-md border border-gray-200 bg-white px-4 py-2
                       text-sm font-medium text-gray-700 shadow-sm transition-all
                       hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-100 hover:shadow-md
                       active:translate-y-0 active:shadow-sm"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
