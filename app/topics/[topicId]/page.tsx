"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { db, auth } from "../../firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';


export default function TopicDetails() {
  const router = useRouter();
  const params = useParams();
  const topicId = params?.topicId as string;
  const [documents, setDocuments] = useState<Array<{ id: string; fileName: string; chunk?: string }>>([]);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  // Dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<'topic' | 'document' | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Handlers for dialog
  const handleDeleteTopic = () => {
    setConfirmType('topic');
    setConfirmOpen(true);
  };
  // ...existing code...
  const handleConfirmDelete = async () => {
    if (confirmType === 'document' && pendingDeleteId) {
      await deleteDoc(doc(db, "documents", pendingDeleteId));
      setDocuments(documents.filter(d => d.id !== pendingDeleteId));
    }
    if (confirmType === 'topic') {
      await deleteDoc(doc(db, "topics", topicId));
      // Optionally, delete all documents for this topic
      const q = query(collection(db, "documents"), where("topicId", "==", topicId));
      const snapshot = await getDocs(q);
      const batchDeletes = snapshot.docs.map(d => deleteDoc(doc(db, "documents", d.id)));
      await Promise.all(batchDeletes);
      router.push("/topics");
    }
    setConfirmOpen(false);
    setPendingDeleteId(null);
    setConfirmType(null);
  };
  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
    setConfirmType(null);
  };

  useEffect(() => {
  let unsub: (() => void) | undefined;
    let didFetch = false;
    unsub = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      } else if (!didFetch) {
        didFetch = true;
        const fetchDocs = async () => {
          const q = query(collection(db, "documents"), where("topicId", "==", topicId));
          const snapshot = await getDocs(q);
          setDocuments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        };
        fetchDocs();
      }
      setAuthLoading(false);
    });
    return () => unsub && unsub();
  }, [router, topicId]);

  const handleUpload = async () => {
    if (!file) return;
    setStatus("Uploading...");
    try {
      const text = await file.text();
      await addDoc(collection(db, "documents"), {
        topicId,
        fileName: file.name,
        chunk: text,
        uploaded: new Date().toISOString(),
      });
      setStatus("Uploaded!");
      setFile(null);
      const q = query(collection(db, "documents"), where("topicId", "==", topicId));
      const snapshot = await getDocs(q);
      setDocuments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      setStatus("Error uploading");
    }
  };


  // Only handles Q&A logic now
  const handleAsk = async () => {
    setLoading(true);
    setAnswer("");
    const q = query(collection(db, "documents"), where("topicId", "==", topicId));
    const snapshot = await getDocs(q);
    const chunks = snapshot.docs.map(d => d.data().chunk).join("\n");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: chunks, question }),
      });
      const data = await res.json();
      setAnswer(data.answer || "No answer");
    } catch (e) {
      setAnswer("Error calling API");
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography variant="h5" align="center">Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Documents</Typography>
            <Button color="error" variant="outlined" onClick={handleDeleteTopic}>Delete Topic</Button>
          </Box>
          <Dialog open={confirmOpen} onClose={handleCancelDelete}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {confirmType === 'topic'
                  ? 'Are you sure you want to delete this topic? This will remove the topic and all its documents.'
                  : 'Are you sure you want to delete this document?'}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete}>Cancel</Button>
              <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
            </DialogActions>
          </Dialog>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Button variant="contained" component="label">
              Upload
              <input type="file" hidden onChange={e => setFile(e.target.files?.[0] || null)} />
            </Button>
            <Button variant="outlined" onClick={handleUpload} disabled={!file}>Submit</Button>
          </Box>
          {file && (
            <Typography sx={{ mt: 1, fontStyle: 'italic' }}>Selected: {file.name}</Typography>
          )}
          <Typography sx={{ mt: 2 }}>{status}</Typography>
          <List sx={{ mt: 2 }}>
            {documents.map(d => (
              <ListItem key={d.id} secondaryAction={
                <Button color="error" onClick={() => {
                  setPendingDeleteId(d.id);
                  setConfirmType('document');
                  setConfirmOpen(true);
                }}>Delete</Button>
              }>
                <ListItemText primary={d.fileName} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <TextField
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask a question"
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleAsk} disabled={loading || !question}>
            {loading ? "Thinking..." : "Ask"}
          </Button>
          <Typography sx={{ mt: 2 }}><b>Answer:</b> {answer}</Typography>
          <Button variant="text" sx={{ mt: 2 }} onClick={() => router.push("/topics")}>Back</Button>
        </CardContent>
      </Card>
    </Container>
  );
}
