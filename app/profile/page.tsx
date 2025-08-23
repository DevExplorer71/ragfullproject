"use client"
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { useAuth } from '../AuthContext';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: { xs: 4, md: 8 }, px: { xs: 2, md: 0 } }}>
        <Typography variant="h6" align="center">Loading...</Typography>
      </Container>
    );
  }
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
