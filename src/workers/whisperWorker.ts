let worker: Worker | null = null;

export const initWhisperWorker = () => {
  if (!worker) {
    worker = new Worker(new URL('./whisper.worker.ts', import.meta.url));
  }
};

export const runWhisper = (audioBuffer: Float32Array): Promise<string> => {
  return new Promise((resolve) => {
    if (!worker) throw new Error("Whisper worker not initialized");

    worker.onmessage = (e) => {
      resolve(e.data.text); // expects { text: "..." } from worker
    };

    worker.postMessage({ audioBuffer });
  });
};
