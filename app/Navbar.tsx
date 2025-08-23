"use client";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from './firebaseConfig';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<null | { uid: string; email?: string | null }>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

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

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    router.push('/');
  };

  const navLinks = [
    { text: 'Home', href: '/' },
    ...(user ? [
      { text: 'Topics', href: '/topics' },
      { text: 'Profile', href: '/profile' }
    ] : []),
    ...(user ? [] : [{ text: 'Login', href: '/login' }])
  ];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>RAG Full Tutorial</Typography>
          <div style={{ display: 'none', '@media (min-width: 900px)': { display: 'flex' } }}>
            {navLinks.map(link => (
              <Button
                key={link.text}
                color="inherit"
                component={Link}
                href={link.href}
                sx={{ display: { xs: 'none', md: 'inline-flex' } }}
              >
                {link.text}
              </Button>
            ))}
            {user && (
              <Typography variant="body2" sx={{ mx: 2, display: { xs: 'none', md: 'inline-block' } }}>{user.email}</Typography>
            )}
            {user && (
              <Button color="inherit" onClick={handleLogout} sx={{ display: { xs: 'none', md: 'inline-flex' } }}>Logout</Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <List>
          {navLinks.map(link => (
            <ListItem key={link.text} disablePadding>
              <ListItemButton component={Link} href={link.href} onClick={() => setMobileOpen(false)}>
                <ListItemText primary={link.text} />
              </ListItemButton>
            </ListItem>
          ))}
          {user && (
            <ListItem>
              <ListItemText primary={user.email} />
            </ListItem>
          )}
          {user && (
            <ListItem>
              <Button color="inherit" onClick={() => { handleLogout(); setMobileOpen(false); }} fullWidth>Logout</Button>
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
}
