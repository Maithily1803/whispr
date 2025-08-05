'use client';

import { useEffect, useRef } from 'react';

export default function HomePage() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker('/workers/ttsWorker.js');
    workerRef.current = worker;

    worker.onmessage = (event) => {
      const audioBlob = event.data;
      if (audioBlob) {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        console.error("TTS failed or returned no audio.");
      }
    };

    return () => {
      worker.terminate();
    };
  }, []);

  const handleSpeak = () => {
    const text = "Hello! This is a test speech.";
    workerRef.current?.postMessage(text);
  };

  return (
    <main>
      <h1>Offline TTS Test</h1>
      <button onClick={handleSpeak}>Speak</button>
    </main>
  );
}
