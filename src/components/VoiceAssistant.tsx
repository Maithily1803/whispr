// components/VoiceAssistant.tsx

"use client";

import React, { useState } from "react";
import { getReplyFromLLM } from "@/lib/chat";

const VoiceAssistant = () => {
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");

  // Simulate end of speech event with dummy text
  const handleFinalTranscript = async () => {
    const finalText = transcript.trim();
    if (!finalText) return;

    const res = await getReplyFromLLM(finalText);
    setReply(res);
  };

  return (
    <div className="p-4 space-y-4">
      <textarea
        placeholder="Type or paste transcript..."
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        className="w-full border p-2 rounded"
        rows={3}
      />
      <button
        onClick={handleFinalTranscript}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Get LLM Reply
      </button>

      {reply && (
        <div className="mt-4">
          <strong>Assistant:</strong>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
