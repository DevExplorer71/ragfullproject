"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "./firebaseConfig";
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
    const fetchTopics = async () => {
      const snapshot = await getDocs(collection(db, "topics"));
  setTopics(snapshot.docs.map(d => ({ id: d.id, name: d.data().name ?? "" })));
    };
    fetchTopics();
  }, [router]);

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
  );
}
