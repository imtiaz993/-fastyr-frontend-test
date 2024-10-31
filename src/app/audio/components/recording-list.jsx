import { useRef, useState } from "react";
import { StopCircle, Play, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DeleteRecordingModal } from "../components/delete-audio-modal";

const RecordingList = ({ recordings, setRecordings }) => {
  const audioRef = useRef();
  const [playingRecording, setPlayingRecording] = useState(null);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);

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

  return (
    <div className="flex gap-4">
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
                handleDelete={() => deleteRecording(recording.id)}
                setOpen={setIsOpenDeletePopup}
              />
            </Dialog>
          </div>
        </Card>
      ))}
      <audio ref={audioRef} onEnded={stopPlaying} />
    </div>
  );
};

export default RecordingList;
