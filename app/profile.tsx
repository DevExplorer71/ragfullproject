"use client";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { useEffect, useState } from 'react';
import { auth } from './firebaseConfig';
import { User } from 'firebase/auth';
export default function ProfilePage() {
  const [user, setUser] = useState<null | { uid: string; email?: string | null; photoURL?: string | null; displayName?: string | null }>(null);

  useEffect(() => {
    const setMappedUser = (u: User | null) => {
      if (u) {
        setUser({
          uid: u.uid,
          email: u.email ?? null,
          photoURL: u.photoURL ?? null,
          displayName: u.displayName ?? null
        });
      } else {
        setUser(null);
      }
    };
    setMappedUser(auth.currentUser);
    const unsub = auth.onAuthStateChanged((u: User | null) => {
      if (u) {
        setUser({
          uid: u.uid,
          email: u.email ?? null,
          photoURL: u.photoURL ?? null,
          displayName: u.displayName ?? null
        });
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: { xs: 4, md: 8 }, px: { xs: 2, md: 0 } }}>
        <Typography variant="h5" align="center" sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
          You must be logged in to view your profile.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 4, md: 8 }, px: { xs: 2, md: 0 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Avatar src={user.photoURL || undefined} sx={{ width: { xs: 60, md: 80 }, height: { xs: 60, md: 80 } }} />
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>{user.displayName || 'No Name'}</Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>Email: {user.email}</Typography>
        <Typography variant="body2" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>UID: {user.uid}</Typography>
      </Box>
    </Container>
  );
}
