"use client";

import { NextPage } from "next";
import ReactPlayer from "react-player";

interface Props {
  videoSrc: string;
  isPlaying: boolean;
}
const VideoPlayer: NextPage<Props> = (props) => {
  const { videoSrc, isPlaying } = { ...props };

  return (
    <div className="mx-auto w-[600px] max-w-full">
      <ReactPlayer
        url={videoSrc}
        playing={isPlaying}
        controls={true}
        width="100%"
        style={{
          outline: "1px solid #E8E8E8",
          borderRadius: "5px",
          padding: "5px",
          backgroundColor: "#FAFAFA",
        }}
      />
    </div>
  );
};

export default VideoPlayer;
