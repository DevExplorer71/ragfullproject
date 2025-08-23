"use client";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>Welcome to RAG Full Tutorial</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        This app demonstrates a full-stack Retrieval-Augmented Generation (RAG) workflow using Next.js and Firebase. <br />
        You can explore topics, upload documents, and interact with AI-powered features. <br />
        Use the navigation bar to log in, view your profile, and access all features.
      </Typography>
      <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
        Get started by logging in from the navbar above!
      </Typography>
    </Container>
  );
}
