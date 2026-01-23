"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react";
import useWindowSize from "../hooks/useWindowSize";
import { Button, CTAButton, OutlineButton } from "./global/Buttons";

interface HeroButton {
  text: string;
  link: string;
}

interface HeroData {
  title: string;
  subtitle?: string;
  video?: string;
  image?: string;
  button1: HeroButton;
  button2?: HeroButton;
}

interface HeroProps {
  data: HeroData;
}

export default function Hero({ data }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const mounted = useRef(true);
  const autoplayRetryCount = useRef(0);
  const maxRetries = 3;

  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVideoPlaying, setIsModalVideoPlaying] = useState(false);
  const [autoplayStatus, setAutoplayStatus] = useState<
    "idle" | "attempting" | "success" | "failed"
  >("idle");

  const { isMobile, isSmallTablet, isTablet } = useWindowSize();

  // mounted guard
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // sync muted state to element
  useEffect(() => {
    const v = videoRef.current;
    if (v && v.muted !== isMuted) v.muted = isMuted;
  }, [isMuted]);

  // Attach media listeners for background video
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => {
      if (process.env.NODE_ENV === "development") {
        console.log("[Hero] video loadedmetadata", v.currentSrc || data.video);
      }
      if (mounted.current) setIsVideoReady(true);
    };
    const onPlay = () => {
      if (mounted.current) {
        setHasPlayed(true);
        setIsPlaying(true);
        setAutoplayBlocked(false);
        setAutoplayStatus("success");
      }
    };
    const onPause = () => {
      if (mounted.current) setIsPlaying(false);
    };
    const onError = (ev: any) => {
      const err = v.error;
      const msg = err
        ? `code:${err.code} message:${(err as any).message || "unknown"}`
        : "unknown error event";
      setLoadError(msg);
      if (process.env.NODE_ENV === "development") {
        console.error("[Hero] video error", msg, ev);
      }
    };

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("error", onError);

    // Start muted for mobile, unmuted for desktop
    v.muted = isMobile;

    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("error", onError);
    };
  }, [data.video, isMobile]);

  // Modal video event listeners
  useEffect(() => {
    const v = modalVideoRef.current;
    if (!v || !isModalOpen) return;

    const onPlay = () => {
      setIsModalVideoPlaying(true);
    };
    const onPause = () => {
      setIsModalVideoPlaying(false);
    };
    const onEnded = () => {
      setIsModalVideoPlaying(false);
    };

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);

    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
    };
  }, [isModalOpen]);

  // Smart autoplay strategy with retries
  const attemptAutoplay = useCallback(
    async (retryCount = 0) => {
      if (!videoRef.current) return;

      const v = videoRef.current;

      try {
        setAutoplayStatus("attempting");

        // Strategy 1: Try unmuted autoplay first
        if (!isMuted) {
          try {
            await v.play();
            if (process.env.NODE_ENV === "development") {
              console.log("[Hero] Autoplay with sound succeeded");
            }
            return true;
          } catch (unmutedError) {
            if (process.env.NODE_ENV === "development") {
              console.warn(
                "[Hero] Unmuted autoplay failed, trying muted:",
                unmutedError,
              );
            }
          }
        }

        // Strategy 2: Try muted autoplay
        v.muted = true;
        setIsMuted(true);
        await v.play();

        if (process.env.NODE_ENV === "development") {
          console.log("[Hero] Muted autoplay succeeded");
        }
        return true;
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[Hero] Autoplay attempt ${retryCount + 1} failed:`,
            error,
          );
        }

        // Strategy 3: Retry with delay for certain error types
        if (retryCount < maxRetries) {
          const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 5000);
          setTimeout(() => {
            if (mounted.current && videoRef.current) {
              attemptAutoplay(retryCount + 1);
            }
          }, retryDelay);
        } else {
          // All attempts failed
          if (mounted.current) {
            setAutoplayStatus("failed");
            setAutoplayBlocked(true);
          }
        }
        return false;
      }
    },
    [isMuted],
  );

  // Attempt autoplay when video is ready
  useEffect(() => {
    if (!isVideoReady || autoplayStatus !== "idle") return;

    const timer = setTimeout(() => {
      void attemptAutoplay();
    }, 300);

    return () => clearTimeout(timer);
  }, [isVideoReady, autoplayStatus, attemptAutoplay]);

  // Global keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isModalOpen) return;

      const active = (document.activeElement?.tagName || "").toLowerCase();
      if (active === "input" || active === "textarea") return;
      if (e.code === "Space") {
        e.preventDefault();
        void togglePlay();
      } else if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        toggleMute();
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [isModalOpen]);

  // Pause when tab hidden, resume when visible
  useEffect(() => {
    const onVis = () => {
      const v = videoRef.current;
      if (!v) return;

      if (document.hidden) {
        if (!v.paused) {
          v.pause();
        }
      } else {
        if (hasPlayed && v.paused) {
          setTimeout(() => {
            if (mounted.current && v.paused) {
              void v.play().catch((err) => {
                if (process.env.NODE_ENV === "development") {
                  console.warn(
                    "[Hero] Resume after visibility change failed:",
                    err,
                  );
                }
              });
            }
          }, 100);
        }
      }
    };

    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [hasPlayed]);

  // toggle play/pause for background video
  const togglePlay = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;

    try {
      if (v.paused) {
        if (autoplayBlocked) {
          const success = await attemptAutoplay();
          if (success) return;
        }
        await v.play();
        if (mounted.current) setIsPlaying(true);
      } else {
        v.pause();
        if (mounted.current) setIsPlaying(false);
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Hero] togglePlay failed:", err);
      }
      if (mounted.current) setAutoplayBlocked(true);
    }
  }, [autoplayBlocked, attemptAutoplay]);

  // toggle mute/unmute
  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (v) {
      v.muted = !v.muted;
      setIsMuted(v.muted);
    } else {
      setIsMuted((s) => !s);
    }
  }, []);

  // Modal functions
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setIsModalVideoPlaying(false);

    const modalVideo = modalVideoRef.current;
    if (modalVideo && !modalVideo.paused) {
      modalVideo.pause();
    }
  }, []);

  const toggleModalPlay = useCallback(async () => {
    const modalVideo = modalVideoRef.current;
    if (!modalVideo) return;

    try {
      if (modalVideo.paused) {
        await modalVideo.play();
        setIsModalVideoPlaying(true);
      } else {
        modalVideo.pause();
        setIsModalVideoPlaying(false);
      }
    } catch (err) {
      console.warn("Modal video play failed:", err);
    }
  }, []);

  // Show overlay play button when autoplay is blocked
  const showOverlayPlay =
    autoplayBlocked ||
    (!hasPlayed && !isPlaying && autoplayStatus === "failed");

  return (
    <>
      <section
        className="relative w-full h-screen min-h-150 overflow-hidden bg-black"
        aria-label="Hero section with background video"
        role="region"
      >
        {/* Background video - Show when playing, hide when paused */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
            isPlaying ? "opacity-100" : "opacity-0"
          }`}
          src={data.video}
          poster={data.image}
          playsInline
          muted={isMuted}
          loop
          preload="auto"
          onCanPlay={() => {
            if (process.env.NODE_ENV === "development") {
              console.log("[Hero] onCanPlay fired");
            }
            setIsVideoReady(true);
          }}
          onError={() => {
            const v = videoRef.current;
            const err = v?.error;
            const msg = err ? `code:${err.code}` : "unknown";
            setLoadError(msg);
            if (process.env.NODE_ENV === "development") {
              console.error("[Hero] video onError", msg);
            }
          }}
        />

        {/* Poster image - Show when paused or video not playing */}
        <img
          src={data.image}
          alt="Hero background"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out pointer-events-none ${
            !isPlaying ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/30 to-black/70 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

        {/* Centered Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6 sm:px-8">
            {/* Main Title - Adjusted for mobile */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-lg mb-4 sm:mb-6">
              {data.title}
            </h1>

            {/* Subtitle - Adjusted for mobile */}
            {data.subtitle && (
              <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-6 sm:mb-8 drop-shadow-md px-2">
                {data.subtitle}
              </p>
            )}

            {/* Action Buttons - Show only first button on mobile */}
            <div className="flex flex-row gap-4 justify-center items-center">
              <CTAButton
                href={data.button1.link}
                size="md"
                className="min-w-35 sm:min-w-40"
              >
                {data.button1.text}
              </CTAButton>

              {/* Show second button only on desktop */}
              {data.button2 && !isMobile && (
                <OutlineButton
                  href={data.button2.link}
                  size="md"
                  className="min-w-35 sm:min-w-40 text-white border-white/30 hover:bg-white/10 hover:border-white/50"
                >
                  {data.button2.text}
                </OutlineButton>
              )}
            </div>
          </div>
        </div>

        {/* Controls - Same for all devices */}
        <div className="absolute bottom-8 right-8 flex gap-3 z-20">
          <Button
            onClick={() => void togglePlay()}
            variant="ghost"
            size="sm"
            className="bg-black/50 text-white hover:bg-black/70 border-0"
            aria-pressed={isPlaying}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>

          <Button
            onClick={toggleMute}
            variant="ghost"
            size="sm"
            className="bg-black/50 text-white hover:bg-black/70 border-0"
            aria-pressed={!isMuted}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
        </div>

        {/* Overlay Play Button for Autoplay Block */}
        {showOverlayPlay && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <Button
              onClick={() => void togglePlay()}
              variant="ghost"
              size="lg"
              className="bg-black/45 hover:bg-black/60 text-white p-8 rounded-full border-0"
              aria-label="Play video"
            >
              <Play size={32} />
            </Button>
          </div>
        )}

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black to-transparent pointer-events-none" />

        {/* Screen Reader Announcements */}
        <div aria-live="polite" className="sr-only">
          {isPlaying ? "Video playing" : "Video paused"},{" "}
          {isMuted ? "muted" : "unmuted"}
        </div>
      </section>

      {/* Video Modal - Only for when user wants fullscreen experience */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
          <div className="relative w-full h-full max-w-6xl max-h-[80vh] mx-4">
            {/* Close Button */}
            <Button
              onClick={closeModal}
              variant="ghost"
              size="sm"
              className="absolute -top-12 right-0 z-30 bg-black/50 text-white hover:bg-black/70 border-0"
              aria-label="Close video modal"
            >
              <X size={24} />
            </Button>

            {/* Modal Video */}
            <video
              ref={modalVideoRef}
              className="w-full h-full object-contain rounded-2xl"
              src={data.video}
              playsInline
              controls={false}
              loop
              autoPlay
            />

            {/* Modal Play/Pause Button */}
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <Button
                onClick={toggleModalPlay}
                variant="ghost"
                size="lg"
                className={`bg-black/45 hover:bg-black/60 text-white p-6 rounded-full border-0 transition-opacity ${
                  isModalVideoPlaying
                    ? "opacity-0 hover:opacity-100"
                    : "opacity-100"
                }`}
                aria-label={isModalVideoPlaying ? "Pause video" : "Play video"}
              >
                {isModalVideoPlaying ? <Pause size={32} /> : <Play size={32} />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
