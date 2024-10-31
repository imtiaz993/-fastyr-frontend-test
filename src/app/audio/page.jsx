'use client'

// pages/audio.js
import { useEffect, useRef, useState } from 'react';

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audioURL, setAudioURL] = useState('');
    const mediaRecorderRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                setAudioChunks((prev) => [...prev, event.data]);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error starting recording:", error);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioURL = URL.createObjectURL(audioBlob);
            setAudioURL(audioURL);
            setAudioChunks([]); // Reset audio chunks
        };
        setIsRecording(false);
    };

    const playRecording = () => {
        const audio = new Audio(audioURL);
        audio.play().catch((error) => {
            console.error("Playback error:", error);
        });
    };

    return (
        <div className="audio-recorder">
            <h1>Audio Recorder</h1>
            <div>
                <button onClick={isRecording ? stopRecording : startRecording}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
            </div>
            {audioURL && (
                <div>
                    <h2>Recorded Audio</h2>
                    <audio controls src={audioURL}></audio>
                    <button onClick={playRecording}>Play Last Recording</button>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;

