import React, { useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoPlayer = ({ selectedEpisode, film }) => {
  useEffect(() => {
    const player = videojs("my-video", {
      controls: true,
      autoplay: false,
      preload: "auto",
      fluid: true,
      poster: film.thumb_url,
    });

    return () => {
      if (player) {
        player.dispose(); // Clean up the player instance on component unmount
      }
    };
  }, [selectedEpisode, film.thumb_url]);

  return (
    <div>
      <video
        id="my-video"
        className="video-js"
        controls
        preload="auto"
        width="auto"
        height="480"
        poster={film.thumb_url}
      >
        <source src={selectedEpisode} type="application/x-mpegURL" />
      </video>
      <script src="https://vjs.zencdn.net/8.16.1/video.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/videojs-http-streaming@2.4.2/dist/videojs-http-streaming.min.js"></script>

    </div>
  );
};

export default VideoPlayer;
