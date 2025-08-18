"use client";
import Image from "next/image";
import styles from "./page.module.css";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <h1>Welcome to the app</h1>
      <button onClick={() => router.push("/login")}>Go to Login</button>
    </div>
  );
}
