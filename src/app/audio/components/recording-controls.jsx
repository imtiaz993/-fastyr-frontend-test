import { Mic, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const RecordingControls = ({
  isRecording,
  handleStartRecording,
  handleStopRecording,
}) => {
  return (
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
  );
};

export default RecordingControls;
