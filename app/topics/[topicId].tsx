"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { OpenAIApi, Configuration } from "openai";

const YOUR_OPENAI_API_KEY = "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";

export default function TopicDetails() {
  const router = useRouter();
  const params = useParams();
  const topicId = params?.topicId as string;
  const [documents, setDocuments] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/login");
      return;
    }
    const fetchDocs = async () => {
      const q = query(collection(db, "documents"), where("topicId", "==", topicId));
      const snapshot = await getDocs(q);
      setDocuments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchDocs();
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
    try {
      const text = await file.text();
      const chunks = chunkText(text);
      for (const chunk of chunks) {
        await addDoc(collection(db, "documents"), {
          topicId,
          fileName: file.name,
          chunk,
          uploaded: new Date().toISOString(),
        });
      }
      setStatus("Uploaded and chunked!");
    } catch (e) {
      setStatus("Error uploading");
    }
  };

  // Basic RAG retrieval scaffold
  const handleAsk = async () => {
    // Get all chunks for this topic
    const q = query(collection(db, "documents"), where("topicId", "==", topicId));
    const snapshot = await getDocs(q);
    const chunks = snapshot.docs.map(d => d.data().chunk).join("\n");
    // Call OpenAI (pseudo-code, you need to set your API key securely)
    try {
      const configuration = new Configuration({ apiKey: YOUR_OPENAI_API_KEY });
      const openai = new OpenAIApi(configuration);
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are a helpful assistant. Use the following context to answer questions: ${chunks}` },
          { role: "user", content: question },
        ],
      });
      setAnswer(completion.data.choices[0].message?.content || "No answer");
    } catch (e) {
      setAnswer("Error calling OpenAI");
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "documents", id));
    setDocuments(documents.filter(d => d.id !== id));
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 32 }}>
      <h2>Documents for Topic</h2>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Upload Document</button>
      <p>{status}</p>
      <ul>
        {documents.map(d => (
          <li key={d.id}>
            {d.fileName}
            <button onClick={() => handleDelete(d.id)} style={{ marginLeft: 8 }}>Delete</button>
          </li>
        ))}
      </ul>
      <hr />
      <h3>Ask a question about this topic</h3>
      <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Type your question" style={{ width: "100%" }} />
      <button onClick={handleAsk}>Ask</button>
      <p><b>Answer:</b> {answer}</p>
      <button onClick={() => router.push("/topics")}>Back to Topics</button>
    </div>
  );
}
