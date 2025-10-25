import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUsers } from "../lib/api";
import type { RandomUser } from "../lib/types";
import UserCard from "../components/UserCard";
import { useSavedUsers } from "../hooks/useSavedUsers";
import Spinner from "../components/Spinner";

const PAGE_SIZE = 12;

export default function Home() {
  const { save, has } = useSavedUsers();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    hasNextPage,
  } = useInfiniteQuery<RandomUser[]>({
    queryKey: ["users", PAGE_SIZE],
    queryFn: ({ pageParam = 1 }) => getUsers(pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 0 ? undefined : allPages.length + 1,
  });

  const users = (data?.pages || []).flat();

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const [e] = entries;
        if (e.isIntersecting) fetchNextPage();
      },
      { rootMargin: "200px" } 
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-semibold">Random Users</h2>
        <button
          className="ml-auto rounded-full border border-gray-200 px-3 py-2 text-sm transition-colors hover:bg-gray-100 bg-white cursor-pointer"
          onClick={() => refetch()}
        >
          Refresh
        </button>
      </div>

      {isLoading && <div className="text-sm text-gray-500">Loading users…</div>}
      {isError && (
        <div className="text-sm text-red-600">
          Failed to load users. Try again.
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onSave={!has(user.id) ? save : undefined}
          />
        ))}
      </div>

      <div ref={sentinelRef} />

      <div className="pt-4">
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage || hasNextPage === false}
          className={`group mx-auto flex w-full items-center justify-center gap-2
                      rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-800
                      shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-100 hover:shadow-md
                      active:translate-y-0 active:shadow-sm disabled:cursor-not-allowed disabled:opacity-60
                      md:w-auto md:min-w-[180px]`}
          aria-live="polite"
        >
          {isFetchingNextPage ? (
            <>
              <Spinner />
              <span>Loading…</span>
            </>
          ) : hasNextPage === false ? (
            "No more users"
          ) : (
            <>
              <span className="transition-transform group-hover:translate-x-0.5">
                Load more
              </span>
              <span
                aria-hidden="true"
                className="text-gray-400 transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
