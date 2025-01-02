import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css'; 

const VideoPlayer = () => {
  return (
    <div>
      <video
        id="my-video"
        className="video-js"
        controls
        preload="auto"
        width="1280"
        height="720"
        poster=""
        data-setup="{}"
      >
        <source src="" type="application/x-mpegURL" />
       
        <p className="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to a web browser that{' '}
          <a href="https://videojs.com/html5-video-support/" target="_blank" rel="noopener noreferrer">
            supports HTML5 video
          </a>
        </p>
      </video>
      <script src="https://vjs.zencdn.net/8.16.1/video.min.js"></script>
    </div>
  );
};

export default VideoPlayer;





