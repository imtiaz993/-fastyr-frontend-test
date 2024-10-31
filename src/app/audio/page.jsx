"use client";

import dynamic from "next/dynamic";

const AudioClient = dynamic(() => import("./components/audio-client"), {
  ssr: false,
});

const AudioPage = () => {
  return <AudioClient />;
};

export default AudioPage;
