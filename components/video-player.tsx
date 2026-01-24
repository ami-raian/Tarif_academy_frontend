"use client";

import { useState } from "react";

interface VideoPlayerProps {
  videoGuid: string;
  title: string;
  autoplay?: boolean;
  responsive?: boolean;
}

// Bunny Stream Library ID - set this in your .env.local
const BUNNY_LIBRARY_ID = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || "";

export const VideoPlayer = ({
  videoGuid,
  title,
  autoplay = false,
  responsive = true,
}: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Bunny Stream iframe embed URL
  const embedUrl = `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoGuid}?autoplay=${autoplay}&loop=false&muted=false&preload=true&responsive=true`;

  if (!videoGuid || !BUNNY_LIBRARY_ID) {
    return (
      <div className="flex items-center justify-center bg-muted rounded-lg aspect-video">
        <p className="text-muted-foreground">
          {!BUNNY_LIBRARY_ID
            ? "Bunny Library ID not configured"
            : "Video not available"}
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
          <p className="text-destructive">Failed to load video</p>
        </div>
      )}

      {/* Bunny Stream iframe */}
      <div
        className={responsive ? "aspect-video" : ""}
        style={responsive ? {} : { width: "100%", height: "400px" }}
      >
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          className="w-full h-full rounded-lg"
          style={{ border: "none" }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
        />
      </div>
    </div>
  );
};

// Alternative: Direct video player using HLS (requires hls.js)
// Useful if you want more control over the player
interface DirectVideoPlayerProps {
  videoGuid: string;
  pullZone: string;
  title: string;
}

export const DirectVideoPlayer = ({
  videoGuid,
  pullZone,
  title,
}: DirectVideoPlayerProps) => {
  // HLS URL format for Bunny CDN
  const hlsUrl = `https://${pullZone}.b-cdn.net/${videoGuid}/playlist.m3u8`;

  return (
    <div className="aspect-video">
      <video
        controls
        className="w-full h-full rounded-lg"
        title={title}
        playsInline
      >
        <source src={hlsUrl} type="application/x-mpegURL" />
        Your browser does not support HLS video.
      </video>
    </div>
  );
};

export default VideoPlayer;
