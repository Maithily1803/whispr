self.onmessage = async (event) => {
  const { type, audioBuffer } = event.data;

  if (type === 'transcribe') {
    try {
      // Simulate fake transcription (replace with actual Whisper call)
      const dummyTranscript = 'This is a fake transcript.';
      self.postMessage({ type: 'result', data: dummyTranscript });
    } catch (err) {
      self.postMessage({ type: 'error', data: (err as Error).message });
    }
  }
};

export {}; // Makes TS treat this as a module
