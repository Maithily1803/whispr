self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) =>
      cache.addAll([
        "/manifest.json",
        "/wasm/whisper.wasm",
        "/wasm/tts-model.onnx"
      ])
    )
  );
});

