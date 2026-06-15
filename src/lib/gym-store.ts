import { useEffect, useState } from "react";

const KEY = "shapeup:gym";

export type Gym = {
  name: string;
  unit?: string;
  city?: string;
  code?: string;
};

const DEFAULT_GYM: Gym = {
  name: "Academia Gaviões 24 horas",
  unit: "Unidade Centro",
  city: "São Paulo - SP",
  code: "GAV-2024",
};

function read(): Gym | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Gym) : null;
  } catch {
    return null;
  }
}

export function useGym() {
  const [gym, setGymState] = useState<Gym | null>(null);

  useEffect(() => {
    setGymState(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setGymState(read());
    };
    const onCustom = () => setGymState(read());
    window.addEventListener("storage", onStorage);
    window.addEventListener("shapeup:gym-changed", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("shapeup:gym-changed", onCustom as EventListener);
    };
  }, []);

  const setGym = (g: Gym | null) => {
    if (typeof window === "undefined") return;
    if (g) localStorage.setItem(KEY, JSON.stringify(g));
    else localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("shapeup:gym-changed"));
    setGymState(g);
  };

  return {
    gym,
    isLinked: !!gym,
    link: (g?: Partial<Gym>) => setGym({ ...DEFAULT_GYM, ...g }),
    unlink: () => setGym(null),
    setGym,
  };
}
