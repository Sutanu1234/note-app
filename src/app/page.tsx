"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const isLogin = true; 

  const router = useRouter();

  useEffect(() => {
    if (isLogin) {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [isLogin, router]);

  return null;
}
