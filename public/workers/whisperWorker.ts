let worker: Worker | null = null;

export const initWhisperWorker = () => {
  if (!worker) {
    // NOTE: Load the .js version not .ts
    worker = new Worker('/workers/whisper.worker.js');
  }
};

export const runWhisper = (audioBuffer: Float32Array): Promise<string> => {
  return new Promise((resolve) => {
    if (!worker) throw new Error('Whisper worker not initialized');

    worker.onmessage = (e) => {
      resolve(e.data.text);
    };

    worker.postMessage({ audioBuffer });
  });
};

