"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useReactMediaRecorder } from "react-media-recorder";
import { encode } from "base64-arraybuffer";
import { Mic, StopCircle, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteRecordingModal } from "./components/delete-audio-modal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

const AudioPage = () => {
  const [recordings, setRecordings] = useState([]);
  const [playingRecording, setPlayingRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);
  const audioRef = useRef(null);

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

  const { startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      onStop: saveRecording,
    });

  useEffect(() => {
    const savedRecordings = localStorage.getItem("recordings");
    if (savedRecordings) {
      setRecordings(JSON.parse(savedRecordings));
    }
  }, []);

  const playRecording = (base64Audio) => {
    setPlayingRecording(base64Audio);
    const audioData = Uint8Array.from(atob(base64Audio), (c) =>
      c.charCodeAt(0)
    );
    const audioBlob = new Blob([audioData], { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      setPlayingRecording(null);
    }
  };

  const deleteRecording = (id) => {
    const recordingToDelete = recordings.find((rec) => rec.id === id);

    if (playingRecording === recordingToDelete.base64) {
      stopPlaying();
    }

    const updatedRecordings = recordings.filter(
      (recording) => recording.id !== id
    );
    setRecordings(updatedRecordings);
    localStorage.setItem("recordings", JSON.stringify(updatedRecordings));
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    startRecording();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    stopRecording();
    stopPlaying();
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl mb-4">Recordings</h1>
        <div className="flex gap-x-2">
          {isRecording ? (
            <Button onClick={handleStopRecording}>
              <StopCircle size={20} /> Stop Recording
            </Button>
          ) : (
            <Button onClick={handleStartRecording}>
              <Mic size={20} /> Start Recording
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {recordings.length === 0 && <p>No recordings found</p>}
        {recordings.map((recording) => (
          <Card key={recording.id} className="p-4">
            <div className="flex justify-center gap-x-2">
              <Button
                onClick={() => {
                  playingRecording === recording.base64
                    ? stopPlaying()
                    : playRecording(recording.base64);
                }}
              >
                {playingRecording === recording.base64 ? (
                  <StopCircle size={20} />
                ) : (
                  <Play size={20} />
                )}
                {playingRecording === recording.base64 ? "Stop" : "Play"}
              </Button>
              <Dialog
                open={isOpenDeletePopup}
                onOpenChange={setIsOpenDeletePopup}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 size={20} /> Delete
                  </Button>
                </DialogTrigger>
                <DeleteRecordingModal
                  handleDelete={() => {
                    deleteRecording(recording.id);
                  }}
                  setOpen={setIsOpenDeletePopup}
                />
              </Dialog>
            </div>
          </Card>
        ))}
      </div>
      <audio ref={audioRef} onEnded={stopPlaying} />
    </div>
  );
};

export default AudioPage;
