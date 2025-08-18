"use client";
import { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function Upload() {
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
