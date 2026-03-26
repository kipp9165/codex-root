"use client";

import { useEffect, useState } from "react";
import { getMe } from "../lib/codexRoot";

export function useMe(email) {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(!!email);

  useEffect(() => {
    if (!email) return;
    setLoading(true);
    getMe(email)
      .then(setMe)
      .finally(() => setLoading(false));
  }, [email]);

  return { me, loading };
}
