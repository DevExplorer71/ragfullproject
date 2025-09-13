"use client";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import CookieNotice from '../components/CookieNotice';


export default function Home() {

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 4, md: 8 }, textAlign: 'center', px: { xs: 2, md: 0 } }}>
      <Typography variant="h3" gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
        Welcome to RAG Full Tutorial
      </Typography>
      <Typography variant="body1" sx={{ mt: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}>
        This app demonstrates a full-stack Retrieval-Augmented Generation (RAG) workflow using Next.js and Firebase.<br />
        You can explore topics, upload documents, and interact with AI-powered features.<br />
        Use the navigation bar to log in, view your profile, and access all features.
      </Typography>
      <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary', fontSize: { xs: '0.9rem', md: '1rem' } }}>
        Get started by logging in from the navbar above!
      </Typography>
  <CookieNotice />
    </Container>
  );
}
