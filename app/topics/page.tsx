"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from "next/navigation";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

export default function TopicsPage() {
  const [topics, setTopics] = useState<Array<{ id: string; name: string }>>([]);
  const [newTopic, setNewTopic] = useState("");
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (!loading && user) {
      const fetchTopics = async () => {
        const snapshot = await getDocs(collection(db, "topics"));
        setTopics(snapshot.docs.map(d => ({ id: d.id, name: d.data().name ?? "" })));
      };
      fetchTopics();
    }
  }, [router, user, loading]);

  const handleCreate = async () => {
    if (!newTopic) return;
    const docRef = await addDoc(collection(db, "topics"), { name: newTopic });
    setTopics([...topics, { id: docRef.id, name: newTopic }]);
    setNewTopic("");
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "topics", id));
    setTopics(topics.filter(t => t.id !== id));
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: { xs: 4, md: 8 }, px: { xs: 2, md: 0 } }}>
        <Typography variant="h6" align="center">Loading...</Typography>
      </Container>
    );
  }

  if (!user) {
    // Don't render anything while redirecting
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 4, md: 8 }, px: { xs: 2, md: 0 } }}>
      <Typography variant="h4" gutterBottom align="center">Topics</Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
        <TextField
          value={newTopic}
          onChange={e => setNewTopic(e.target.value)}
          placeholder="New topic name"
          variant="outlined"
          size="small"
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleCreate} sx={{ minWidth: 120 }}>
          Create Topic
        </Button>
      </Box>
      <List>
        {topics.map(t => (
          <ListItem key={t.id} secondaryAction={
            <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(t.id)}>
              Delete
            </Button>
          } disablePadding>
            <ListItemButton onClick={() => router.push(`/topics/${t.id}`)}>
              <ListItemText primary={t.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
