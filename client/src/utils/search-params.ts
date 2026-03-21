export const setValueToSearchParam = (key: string, value: string) => {
  const search = new URLSearchParams(window.location.search);
  search.set(key, value);
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${search.toString()}`
  );
};

export const deleteSearchParam = (key: string) => {
  const search = new URLSearchParams(window.location.search);
  search.delete(key);
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${search.toString()}`
  );
};

export function clearAllSearchParams() {
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    url.search = "";
    window.history.replaceState(null, "", url.toString());
  }
}

export function hasSearchParams(keysToIgnore: string[] = []): boolean {
  if (typeof window === "undefined") return false;

  const url = new URL(window.location.href);
  const params = url.searchParams;

  for (const [key] of params.entries()) {
    if (!keysToIgnore.includes(key)) {
      return true; // Found a param not in the ignore list
    }
  }

  return false; // All params were ignored or no params at all
}
