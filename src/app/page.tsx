'use client';

import { useEffect, useState } from 'react';
import { initWhisperWorker, runWhisper } from '../../public/workers/whisperWorker';

export default function HomePage() {
  const [transcript, setTranscript] = useState('');
  const [recording, setRecording] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<Float32Array | null>(null);

  // ✅ Register the Service Worker here
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((reg) => {
          console.log('SW registered: ', reg);
        })
        .catch((err) => {
          console.error('SW registration failed: ', err);
        });
    }

    initWhisperWorker();
  }, []);

  const handleRecord = async () => {
    setRecording(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    const chunks: Float32Array[] = [];

    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      chunks.push(new Float32Array(input));
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    setTimeout(async () => {
      processor.disconnect();
      source.disconnect();
      stream.getTracks().forEach((track) => track.stop());
      setRecording(false);

      const combined = Float32Array.from(chunks.flat());
      setAudioBuffer(combined);

      const text = await runWhisper(combined);
      setTranscript(text);
    }, 5000); // record for 5 seconds
  };

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">🎤 Whisper Voice Assistant</h1>
      <button
        onClick={handleRecord}
        disabled={recording}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {recording ? 'Recording...' : 'Start Recording'}
      </button>

      {transcript && (
        <p className="mt-6 text-gray-800">
          <strong>Transcript:</strong> {transcript}
        </p>
      )}
    </main>
  );
}
