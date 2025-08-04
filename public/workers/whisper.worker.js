/// <reference lib="webworker" />

importScripts('/wasm/libmain.js'); // <-- Your Emscripten-generated glue

let isInitialized = false;

function initWhisper() {
  return new Promise<void>((resolve) => {
    if (isInitialized) return resolve();

    Module['onRuntimeInitialized'] = () => {
      isInitialized = true;
      resolve();
    };
  });
}

self.onmessage = async (event) => {
  const { audioBuffer } = event.data;
  await initWhisper();

  try {
    // 🧠 Call whisper_transcribe from whisper.cpp
    const resultPtr = Module.ccall(
      'whisper_transcribe',
      'number',
      ['array', 'number'],
      [audioBuffer, audioBuffer.length]
    );

    const text = Module.UTF8ToString(resultPtr);
    self.postMessage({ text });
  } catch (err) {
    self.postMessage({ text: '[Whisper Worker Error] ' + err.message });
  }
};
