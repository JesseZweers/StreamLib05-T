"use client";

import { useEffect, useRef, memo, useState } from "react";
import Plyr from "plyr";
import Hls from "hls.js";
import { PLAYER_CONFIG } from "@/lib/config/config";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import "plyr/dist/plyr.css";

interface VideoPlayerProps {
  url: string;
  title?: string;
  poster?: string;
}

interface Quality {
  label: string;
  value: number;
}

const VideoPlayerComponent = ({ url, title, poster }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr>();
  const hlsRef = useRef<Hls>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qualities, setQualities] = useState<Quality[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(720);

  useEffect(() => {
    if (!videoRef.current || !url) return;

    let initialized = false;

    const initializeHls = () => {
      if (initialized) return; // Prevent reinitialization
      initialized = true;

      setError(null);
      setIsLoading(true);

      // Clean up previous HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        // hlsRef.current = null;
      }

      if (!Hls.isSupported()) {
        setError("Your browser does not support HLS playback");
        setIsLoading(false);
        return;
      }

      const proxyUrl = `/api/stream?url=${encodeURIComponent(url)}`;
      console.log("🎥 Loading stream:", proxyUrl);

      const hls = new Hls({
        maxBufferSize: 0,
        maxBufferLength: 30,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        debug: false,
      });

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log("📺 HLS Media attached");
      });

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        console.log("📺 Stream manifest parsed:", data);
        setIsLoading(false);

        const availableQualities = data.levels
          .map((level) => ({
            label: `${level.height}p`,
            value: level.height,
          }))
          .sort((a, b) => b.value - a.value);

        setQualities(availableQualities);

        const defaultQuality =
          availableQualities.find((q) => q.value === 720)?.value ||
          availableQualities[0]?.value;
        setCurrentQuality(defaultQuality);

        videoRef.current?.play().catch((err) => {
          console.warn("Auto-play failed:", err);
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error("🚨 HLS error:", data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("📡 Network error, attempting to recover...");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("🎥 Media error, attempting to recover...");
              hls.recoverMediaError();
              break;
            default:
              console.error("❌ Fatal error, destroying player");
              setError("Failed to load stream");
              hls.destroy();
              break;
          }
        }
      });

      try {
        hls.loadSource(proxyUrl);
        hls.attachMedia(videoRef.current!);
        hlsRef.current = hls;
      } catch (error) {
        console.error("Failed to initialize HLS:", error);
        setError("Failed to initialize video player");
        setIsLoading(false);
        hls.destroy();
      }
    };

    const initializeNativeHls = () => {
      if (initialized || !videoRef.current) return;
      initialized = true;

      const proxyUrl = `/api/stream?url=${encodeURIComponent(url)}`;
      videoRef.current.src = proxyUrl;
      videoRef.current.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        videoRef.current?.play().catch(console.error);
      });
      videoRef.current.addEventListener("error", () => {
        setError("Failed to load stream");
        setIsLoading(false);
      });
    };

    if (Hls.isSupported()) {
      initializeHls();
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      initializeNativeHls();
    } else {
      setError("Your browser does not support HLS playback");
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        // hlsRef.current = null;
      }
      if (playerRef.current) {
        playerRef.current.destroy();
        // playerRef.current = null;
      }
    };
  }, [url]);

  if (error) {
    return (
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <p className="text-white">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
      <video ref={videoRef} className="w-full h-full" crossOrigin="anonymous" playsInline />
    </div>
  );
};

export const VideoPlayer = memo(VideoPlayerComponent);
VideoPlayer.displayName = "VideoPlayer";
