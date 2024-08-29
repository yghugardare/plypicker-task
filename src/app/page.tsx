"use client";

import { Hero } from "@/components/component/hero";
import fetchUser from "@/lib/fetch-user";
import useUserStore from "@/store/user-store";
import { useEffect } from "react";

export default function Home() {
  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    const user = fetchUser();
    setUser(user);
  }, [setUser]);
  return (
    <Hero/>
  );
}
