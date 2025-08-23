"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "../firebaseConfig";

import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";


export default function TopicsPage() {
  const [topics, setTopics] = useState<Array<{ id: string; name: string }>>([]);
  const [newTopic, setNewTopic] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/login");
      return;
    }
    (async () => {
      const snapshot = await getDocs(collection(db, "topics"));
  setTopics(snapshot.docs.map(d => ({ id: d.id, name: d.data().name ?? "" })));
    })();
  }, [router]);

  const handleCreate = async () => {
    if (!newTopic) return;
    const docRef = await addDoc(collection(db, "topics"), { name: newTopic });
    setTopics([...topics, { id: docRef.id, name: newTopic }]);
    setNewTopic("");
  };


  // Dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    await deleteDoc(doc(db, "topics", pendingDeleteId));
    setTopics(topics.filter(t => t.id !== pendingDeleteId));
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  const handleOpenDialog = (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleCancelDialog = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom align="center">Topics</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="New topic name"
            value={newTopic}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTopic(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleCreate}>Create Topic</Button>
        </Box>
        {topics.length === 0 ? (
          <Typography variant="body2" align="center" color="text.secondary">No topics yet. Create one above!</Typography>
        ) : (
          <List>
            {topics.map(topic => (
              <ListItem
                key={topic.id}
                secondaryAction={
                  <Button color="error" onClick={() => handleOpenDialog(topic.id)}>Delete</Button>
                }
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  boxShadow: 1,
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 4, bgcolor: 'action.hover' }
                }}
              >
                <ListItemText
                  primary={
                    <span
                      style={{ cursor: "pointer", color: "#1976d2", fontWeight: 500 }}
                      onClick={() => router.push(`/topics/${topic.id}`)}
                    >
                      {topic.name}
                    </span>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
        {/* MUI Dialog for delete confirmation */}
        <Dialog open={confirmOpen} onClose={handleCancelDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this topic? This will remove the topic and all its documents.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDialog}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
