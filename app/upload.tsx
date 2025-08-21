"use client";
import { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function Upload() {
  const router = require('next/navigation').useRouter();
  const auth = require('./firebaseConfig').auth;
  // Redirect to login if not authenticated
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user: any) => {
      if (!user) router.push('/login');
    });
    return () => unsub();
  }, [router]);
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState<File | null>(null);
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
    } catch (e) {
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
