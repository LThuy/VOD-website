import React, { useEffect, useRef, useState } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import artplayerPluginHlsControl from 'artplayer-plugin-hls-control';
import 'https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.js';

const VideoPlayerHLS = ({ selectedEpisode, style, thumbnail, poster }) => {
    const artRef = useRef(null); // Reference to store the Artplayer instance
    const playerContainerRef = useRef(null); // Reference to the player container div
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!selectedEpisode) return;  // Ensure selectedEpisode is available

        const initPlayer = () => {
            const art = new Artplayer({
                container: playerContainerRef.current,
                url: selectedEpisode,
                poster: thumbnail,
                setting: true,
                // autoSize: true,
                pip: true,
                fullscreen: true,
                fullscreenWeb: true,
                // autoplay: true,
                playbackRate: true,
                aspectRatio: true,
                playsinline: true,
                autoPlayback: true,
                plugins: [
                    artplayerPluginHlsControl({
                        quality: {
                            control: true,
                            setting: true,
                            getName: (level) => level.height + 'P',
                            title: 'Quality',
                            auto: 'Auto',
                        },
                        audio: {
                            control: true,
                            setting: true,
                            getName: (track) => track.name,
                            title: 'Audio',
                            auto: 'Auto',
                        }
                    }),
                ],
                thumbnails: {
                    number: 60,
                    column: 10,
                    scale: 0.85,
                },
                customType: {
                    m3u8: function playM3u8(video, url, art) {
                        if (Hls.isSupported()) {
                            if (art.hls) art.hls.destroy();
                            const hls = new Hls();
                            hls.loadSource(url);
                            hls.attachMedia(video);
                            art.hls = hls;
                            art.on('destroy', () => hls.destroy());
                        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                            video.src = url;
                        } else {
                            art.notice.show = 'Unsupported playback format: m3u8';
                        }
                    }
                }
            });

            artRef.current = art;
            setInitialized(true);

            // Cleanup on component unmount
            return () => {
                if (artRef.current) {
                    artRef.current.destroy();
                    artRef.current = null;
                }
            };
        };

        // Only initialize the player when selectedEpisode changes and it is valid
        if (!initialized && selectedEpisode) {
            initPlayer();
        }

    }, [selectedEpisode, initialized]);

    return (
        <div ref={playerContainerRef} className="artplayer-app" style={style} />
    );
};

export default VideoPlayerHLS;
