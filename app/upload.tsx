"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { db } from "./firebaseConfig";
import { auth } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function Upload() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState<File | null>(null);
  // Redirect to login if not authenticated
  useEffect(() => {
  const unsub = auth.onAuthStateChanged((user: import('firebase/auth').User | null) => {
      if (!user) router.push('/login');
    });
    return () => { if (unsub) unsub(); };
  }, [router]);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!topic || !file) return;
    // For demo: just store file name and topic
    try {
      await addDoc(collection(db, "documents"), {
        topic,
        fileName: file.name,
        uploaded: new Date().toISOString(),
      });
      setStatus("Uploaded!");
    } catch {
      setStatus("Error uploading");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 4, md: 8 }, px: { xs: 2, md: 0 } }}>
      <Typography variant="h4" gutterBottom align="center">Upload Document</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Topic"
          label="Topic"
          variant="outlined"
          fullWidth
        />
        <Button variant="contained" component="label">
          Choose File
          <input type="file" hidden onChange={e => setFile(e.target.files?.[0] || null)} />
        </Button>
        <Button variant="contained" color="primary" onClick={handleUpload} disabled={!topic || !file}>
          Upload
        </Button>
        <Typography variant="body2" color={status === "Uploaded!" ? "success.main" : "error.main"}>
          {status}
        </Typography>
      </Box>
    </Container>
  );
  );
}
