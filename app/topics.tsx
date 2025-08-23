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
    <div style={{ maxWidth: 600, margin: "auto", padding: 32 }}>
      <h2>Topics</h2>
      <input value={newTopic} onChange={e => setNewTopic(e.target.value)} placeholder="New topic name" />
      <button onClick={handleCreate}>Create Topic</button>
      <ul>
        {topics.map(t => (
          <li key={t.id}>
            <span style={{ cursor: "pointer", color: "blue" }} onClick={() => router.push(`/topics/${t.id}`)}>{t.name}</span>
            <button onClick={() => handleDelete(t.id)} style={{ marginLeft: 8 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
