"use client";

import { useState, useEffect } from "react";
import { encode } from "base64-arraybuffer";
import { useReactMediaRecorder } from "react-media-recorder";
import RecordingControls from "./recording-controls";
import RecordingList from "./recording-list";

const AudioClient = () => {
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const saveRecording = async (url) => {
    if (url) {
      const response = await fetch(url);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const base64Audio = encode(arrayBuffer);

      const newRecording = {
        id: new Date().getTime(),
        base64: base64Audio,
      };

      const updatedRecordings = [...recordings, newRecording];
      setRecordings(updatedRecordings);
      localStorage.setItem("recordings", JSON.stringify(updatedRecordings));
      clearBlobUrl();
    }
  };

  const { startRecording, stopRecording, clearBlobUrl } = useReactMediaRecorder({
    audio: true,
    onStop: saveRecording,
  });

  useEffect(() => {
    const savedRecordings = localStorage.getItem("recordings");
    if (savedRecordings) {
      setRecordings(JSON.parse(savedRecordings));
    }
  }, []);

  const handleStartRecording = () => {
    setIsRecording(true);
    startRecording();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    stopRecording();
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl mb-4">Recordings</h1>
        <RecordingControls
          isRecording={isRecording}
          handleStartRecording={handleStartRecording}
          handleStopRecording={handleStopRecording}
        />
      </div>
      <RecordingList recordings={recordings} setRecordings={setRecordings} />
    </div>
  );
};

export default AudioClient;
