// import React from 'react';
// import videojs from 'video.js';
// import 'video.js/dist/video-js.css'; 

// const VideoPlayer = () => {
//   return (
//     <div>
//       <video
//         id="my-video"
//         className="video-js"
//         controls
//         preload="auto"
//         width="1280"
//         height="720"
//         poster="https://d104go8mhut32c.cloudfront.net/assets/c501c9d3-c934-4b98-ac26-0904249e144c/Thumbnails/mong-vuot.0000063.jpg"
//         data-setup="{}"
//       >
//         <source src="https://d104go8mhut32c.cloudfront.net/assets/c501c9d3-c934-4b98-ac26-0904249e144c/HLS/mong-vuot.m3u8" type="application/x-mpegURL" />
       
//         <p className="vjs-no-js">
//           To view this video please enable JavaScript, and consider upgrading to a web browser that{' '}
//           <a href="https://videojs.com/html5-video-support/" target="_blank" rel="noopener noreferrer">
//             supports HTML5 video
//           </a>
//         </p>
//       </video>
//       <script src="https://vjs.zencdn.net/8.16.1/video.min.js"></script>
//     </div>
//   );
// };

// export default VideoPlayer;


import React, { useState } from 'react';
import axios from 'axios';

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    setUploadStatus('Uploading...');

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setUploadStatus('Upload successful! File has been uploaded.');
      } else {
        setUploadStatus('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file. Please try again.');
    }
  };

  return (
    <div>
      <h1>Upload a Video</h1>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
        />
        <button type="submit">Upload</button>
      </form>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default VideoUpload;

