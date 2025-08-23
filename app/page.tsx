"use client";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>Welcome to the app</Typography>
      <Button variant="contained" color="primary" onClick={() => router.push("/login")}>Go to Login</Button>
    </Container>
  );
}
