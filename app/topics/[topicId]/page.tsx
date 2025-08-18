"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { db, auth } from "../../firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from "firebase/firestore";
// ...existing code...

export default function TopicDetails() {
  const router = useRouter();
  const params = useParams();
  const topicId = params?.topicId as string;
  const [topicName, setTopicName] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [thinking, setThinking] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/login");
      return;
    }
    setLoading(true);
    // Fetch topic name
    const fetchTopic = async () => {
      const topicRef = doc(db, "topics", topicId);
      const topicSnap = await getDocs(query(collection(db, "topics")));
      const topicDoc = topicSnap.docs.find(d => d.id === topicId);
      setTopicName(topicDoc?.data().name || "");
    };
    // Fetch documents
    const fetchDocs = async () => {
      const q = query(collection(db, "documents"), where("topicId", "==", topicId));
      const snapshot = await getDocs(q);
      setDocuments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    Promise.all([fetchTopic(), fetchDocs()]).then(() => setLoading(false));
  }, [router, topicId]);

  // Simple text chunking function
  function chunkText(text: string, chunkSize = 500) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  }

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setStatus("Uploading...");
    try {
      const text = await file.text();
      const chunks = chunkText(text);
      const uploader = auth.currentUser?.email || "Unknown";
      const uploadedDate = new Date().toISOString();
      for (const chunk of chunks) {
        await addDoc(collection(db, "documents"), {
          topicId,
          fileName: file.name,
          chunk,
          uploaded: uploadedDate,
          uploader,
        });
      }
      setStatus("Uploaded and chunked!");
      // Refresh document list
      const q = query(collection(db, "documents"), where("topicId", "==", topicId));
      const snapshot = await getDocs(q);
      setDocuments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      setStatus("Error uploading");
    }
    setUploading(false);
  };

  // Call RAG/OpenAI API route
  const handleAsk = async () => {
    setThinking(true);
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
      setAnswer(data.answer);
    } catch (e) {
      setAnswer("Error calling RAG API");
    }
    setThinking(false);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "documents", id));
    setDocuments(documents.filter(d => d.id !== id));
  };

  if (loading) {
    return <div><h2>Loading topic...</h2></div>;
  }
  return (
    <div>
      <h2>Topic: {topicName}</h2>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
  <button onClick={handleUpload} disabled={uploading}>Upload Document</button>
  {uploading && <div style={{ width: '100%', background: '#eee', margin: '8px 0' }}><div style={{ width: '100%', height: '8px', background: '#2196f3', transition: 'width 0.3s' }} /></div>}
  <p>{status}</p>
      <ul>
        {documents.map(d => (
          <li key={d.id}>
            <b>{d.fileName}</b><br />
            Uploaded by: {d.uploader || "Unknown"} <br />
            Date: {d.uploaded ? new Date(d.uploaded).toLocaleString() : "Unknown"}
            <button onClick={() => handleDelete(d.id)} style={{ marginLeft: 8 }}>Delete</button>
          </li>
        ))}
      </ul>
      <hr />
      {documents.length === 0 ? (
        <div style={{ color: "red" }}>
          <b>No documents found for this topic. Please upload a document to enable Q&A.</b>
        </div>
      ) : (
        <>
          <h3>Ask a question about this topic</h3>
          <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Type your question" style={{ width: "100%" }} />
          <button onClick={handleAsk} disabled={thinking}>Ask</button>
          {thinking && <p><b>Thinking...</b></p>}
          <p><b>Answer:</b> {answer}</p>
        </>
      )}
      <button onClick={() => router.push("/topics")}>Back to Topics</button>
    </div>
  );
}
