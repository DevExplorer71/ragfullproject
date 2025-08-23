"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setLoading(false);
      router.push("/topics");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, boxShadow: 3, borderRadius: 2, p: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        {isRegister ? "Register" : "Login"}
      </Typography>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
          variant="outlined"
          fullWidth
          disabled={loading}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
          variant="outlined"
          fullWidth
          disabled={loading}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
          {loading ? "Loading..." : isRegister ? "Register" : "Login"}
        </Button>
      </form>
      <Button onClick={() => setIsRegister(r => !r)} color="secondary" fullWidth sx={{ mt: 2 }} disabled={loading}>
        {isRegister ? "Already have an account? Login" : "Need an account? Register"}
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Container>
  );
}
