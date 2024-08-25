"use client";

import fetchUser from "@/lib/fetch-user";
import useUserStore from "@/store/user-store";
import { useEffect } from "react";

export default function Home() {
  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    const user = fetchUser();
    setUser(user);
  }, []);
  return (
    <main>
      <div>hi</div>
    </main>
  );
}
