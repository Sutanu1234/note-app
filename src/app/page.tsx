"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const isLogin = false; 

  const router = useRouter();

  useEffect(() => {
    if (isLogin) {
      router.replace("/dashboard/home");
    } else {
      router.replace("/login");
    }
  }, [isLogin, router]);

  return null;
}
