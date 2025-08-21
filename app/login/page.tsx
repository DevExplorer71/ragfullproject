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
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>Login</Typography>
      <FirebaseAuth />
    </Container>
  );
}
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
