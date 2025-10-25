import { useState } from "react";
import UserCard from "../components/UserCard";
import { useSavedUsers } from "../hooks/useSavedUsers";
import WeatherModal from "../components/WeatherModal";
import type { RandomUser } from "../lib/types";

export default function Saved() {
  const { list, clear, remove } = useSavedUsers();
  const [selected, setSelected] = useState<RandomUser | null>(null);
  const isOpen = selected !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-semibold">Saved Users</h2>
        {list.length > 0 && (
          <button
            className="ml-auto rounded-full border border-gray-200 px-3 py-2 text-sm transition-colors hover:bg-gray-100 bg-white cursor-pointer"
            onClick={clear}
          >
            Clear all
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-gray-500">
          It’s empty for now. Save someone from the main page.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onWeather={setSelected}
              onRemove={remove}
            />
          ))}
        </div>
      )}

      {selected && (
        <WeatherModal
          open={isOpen}
          onClose={() => setSelected(null)}
          lat={selected.location.lat}
          lon={selected.location.lon}
          title={selected.name}
        />
      )}
    </div>
  );
}
