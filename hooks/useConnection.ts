"use client";

import { useEffect, useState } from "react";
import { checkConnection } from "@/services/connection.service";

export function useConnection() {
  const [connected, setConnected] = useState(false);
  const [checking, setChecking] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  async function check() {
    setChecking(true);

    try {
      const result = await checkConnection();
        
      setConnected(result);
      setLastChecked(new Date());
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    check();

    const interval = setInterval(check, 5000);

    window.addEventListener("online", check);
    window.addEventListener("offline", check);

    return () => {
      clearInterval(interval);

      window.removeEventListener("online", check);
      window.removeEventListener("offline", check);
    };
  }, []);

  return {
    connected,
    checking,
    lastChecked,
    recheck: check,
  };
}