"use client";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from './firebaseConfig';
import { User } from 'firebase/auth';
 import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<null | { uid: string; email?: string | null }>(null);
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u: User | null) => {
      if (u) {
        setUser({ uid: u.uid, email: u.email ?? null });
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, []);
 
  const router = useRouter();
  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    router.push('/');
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>RAG Full Tutorial</Typography>
        <Button color="inherit" component={Link} href="/">Home</Button>
        {user && (
          <Button color="inherit" component={Link} href="/topics">Topics</Button>
        )}
        {user && (
          <Button color="inherit" component={Link} href="/profile">Profile</Button>
        )}
        {user && (
          <Typography variant="body2" sx={{ mx: 2 }}>{user.email}</Typography>
        )}
        {user && (
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        )}
        {!user && (
          <Button color="inherit" component={Link} href="/login">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
