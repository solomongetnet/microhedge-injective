import { useEffect, useState } from "react";

export function useHash(onChange?: (newHash: string) => void): string {
  const getHash = () =>
    typeof window !== "undefined" ? window.location.hash : "";

  const [hash, setHash] = useState<string>(getHash);

  useEffect(() => {
    const handleHashChange = () => {
      const newHash = getHash();
      setHash(newHash);
      if (onChange) onChange(newHash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [onChange]);

  return hash;
}
