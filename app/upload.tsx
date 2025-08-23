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
    <div>
      <h2>Upload Document</h2>
      <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic" />
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Upload</button>
      <p>{status}</p>
    </div>
  );
}
