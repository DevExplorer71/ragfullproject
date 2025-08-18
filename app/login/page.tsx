"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FirebaseAuth from "../firebaseAuth";
import { auth } from "../firebaseConfig";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      if (user) router.push("/topics");
    });
    return () => unsub();
  }, [router]);

  return (
    <div>
      <h2>Login</h2>
      <FirebaseAuth />
    </div>
  );
}
