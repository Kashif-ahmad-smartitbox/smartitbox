"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, ArrowRight, X } from "lucide-react";
import useWindowSize from "../../hooks/useWindowSize";

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
  const [isMuted, setIsMuted] = useState(true);
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

  const getContainerPadding = useCallback(() => {
    if (isMobile) return "px-3";
    if (isSmallTablet) return "px-4";
    if (isTablet) return "px-6";
    return "px-8";
  }, [isMobile, isSmallTablet, isTablet]);

  useEffect(() => {
    const v = videoRef.current;
    if (v && v.muted !== isMuted) {
      v.muted = isMuted;
      if (!isMuted && v.hasAttribute("muted")) {
        v.removeAttribute("muted");
      } else if (isMuted) {
        v.setAttribute("muted", "");
      }
    }
  }, [isMuted]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Ensure video has muted attribute for autoplay compliance[citation:1]
    if (!v.hasAttribute("muted")) {
      v.setAttribute("muted", "");
    }

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

    // Always start muted for autoplay compliance[citation:1]
    v.muted = true;

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

  // Simplified autoplay strategy - ALWAYS start muted[citation:1]
  const attemptAutoplay = useCallback(async () => {
    if (!videoRef.current || isMobile) return;

    const v = videoRef.current;

    try {
      setAutoplayStatus("attempting");

      // Critical: Ensure video is muted before attempting autoplay[citation:1]
      if (!v.muted) {
        v.muted = true;
        setIsMuted(true);
      }

      await v.play();

      if (process.env.NODE_ENV === "development") {
        console.log("[Hero] Muted autoplay succeeded");
      }
      setAutoplayStatus("success");
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Hero] Autoplay failed:", error);
      }

      // Retry with a small delay
      autoplayRetryCount.current += 1;
      if (autoplayRetryCount.current < maxRetries) {
        setTimeout(() => {
          if (mounted.current && videoRef.current) {
            void attemptAutoplay();
          }
        }, 500);
      } else {
        // All attempts failed
        if (mounted.current) {
          setAutoplayStatus("failed");
          setAutoplayBlocked(true);
        }
      }
      return false;
    }
  }, [isMobile]);

  // Attempt autoplay when video is ready - with muted attribute[citation:1]
  useEffect(() => {
    if (!isVideoReady || isMobile || autoplayStatus !== "idle") return;

    // Small delay to ensure everything is ready
    const timer = setTimeout(() => {
      void attemptAutoplay();
    }, 100);

    return () => clearTimeout(timer);
  }, [isVideoReady, isMobile, autoplayStatus, attemptAutoplay]);

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
        // Only resume if we were playing and it's not mobile
        if (hasPlayed && v.paused && !isMobile) {
          setTimeout(() => {
            if (mounted.current && v.paused) {
              void v.play().catch((err) => {
                if (process.env.NODE_ENV === "development") {
                  console.warn(
                    "[Hero] Resume after visibility change failed:",
                    err
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
  }, [hasPlayed, isMobile]);

  // toggle play/pause for background video
  const togglePlay = useCallback(async () => {
    if (isMobile) {
      openModal();
      return;
    }

    const v = videoRef.current;
    if (!v) return;

    try {
      if (v.paused) {
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
      // Try with muted if unmuted play failed
      if (!v.muted) {
        v.muted = true;
        setIsMuted(true);
        try {
          await v.play();
          if (mounted.current) setIsPlaying(true);
        } catch (mutedErr) {
          if (mounted.current) setAutoplayBlocked(true);
        }
      } else {
        if (mounted.current) setAutoplayBlocked(true);
      }
    }
  }, [isMobile]);

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
        className="relative w-full h-screen overflow-hidden bg-black"
        aria-label="Hero section with background video"
        role="region"
      >
        {/* Background video - MUST have muted attribute for autoplay[citation:1] */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
            hasPlayed ? "opacity-100" : "opacity-0"
          } ${isMobile ? "hidden" : "block"}`}
          src={data.video}
          poster={data.image}
          playsInline
          muted={isMuted}
          loop
          preload="auto"
          autoPlay
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

        {/* Poster image */}
        <img
          src={data.image}
          alt="Hero background"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out pointer-events-none transform-gpu ${
            hasPlayed && !isMobile
              ? "opacity-0 scale-105"
              : "opacity-100 scale-100"
          }`}
        />

        {/* Dark gradient over video for legibility */}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/10 to-black/50 mix-blend-multiply pointer-events-none" />

        {/* Centered content container */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className={`max-w-7xl w-full ${getContainerPadding()}`}>
            <div className="text-center text-white">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight drop-shadow-md mb-6">
                {data.title}
              </h1>

              {data.subtitle && (
                <p className="text-sm sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto mb-8">
                  {data.subtitle}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={data.button1.link}
                  className="inline-flex items-center justify-center gap-3 px-5 py-3 bg-linear-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg"
                >
                  <span className="text-sm">{data.button1.text}</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>

                {data.button2 && (
                  <a
                    href={data.button2.link}
                    className="inline-flex items-center justify-center gap-3 px-5 py-3 bg-transparent text-white border-2 border-white/30 font-semibold rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] hover:bg-white/5 hover:border-white/50"
                  >
                    <span className="text-sm">{data.button2.text}</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Centered Play/Pause button - visible on desktop */}
        {!isMobile && (
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
            <button
              onClick={() => void togglePlay()}
              className="p-4 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400 hover:scale-110"
              aria-pressed={isPlaying}
              aria-label={isPlaying ? "Pause video" : "Play video"}
              title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="p-4 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400 hover:scale-110"
              aria-pressed={!isMuted}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              title={isMuted ? "Unmute (M)" : "Mute (M)"}
            >
              {isMuted ? (
                <VolumeX className="w-8 h-8" />
              ) : (
                <Volume2 className="w-8 h-8" />
              )}
            </button>
          </div>
        )}

        {/* Mobile play button - centered */}
        {isMobile && (
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
            <button
              onClick={openModal}
              className="p-5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400 flex items-center gap-3 hover:scale-110"
              aria-label="Open video in modal"
            >
              <Play className="w-8 h-8" />
              <span className="text-base font-semibold">Play Video</span>
            </button>
          </div>
        )}

        {/* Big centered overlay play button when autoplay blocked */}
        {showOverlayPlay && !isMobile && (
          <button
            onClick={() => void togglePlay()}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-auto"
            aria-label="Play video"
          >
            <div className="bg-black/45 hover:bg-black/60 p-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
              <Play className="w-16 h-16 text-white" />
            </div>
          </button>
        )}

        {/* Announce status to assistive tech */}
        <div aria-live="polite" className="sr-only">
          {isPlaying ? "Video playing" : "Video paused"},{" "}
          {isMuted ? "muted" : "unmuted"}
        </div>
      </section>

      {/* Video Modal for Mobile */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 z-30 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-300 hover:scale-110"
              aria-label="Close video modal"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Modal video */}
            <video
              ref={modalVideoRef}
              className="w-full h-full object-contain"
              src={data.video}
              playsInline
              controls={false}
              loop
              autoPlay
              muted
            />

            {/* Centered play/pause button for modal */}
            <button
              onClick={toggleModalPlay}
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center pointer-events-auto"
              aria-label={isModalVideoPlaying ? "Pause video" : "Play video"}
            >
              <div
                className={`bg-black/45 hover:bg-black/60 p-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isModalVideoPlaying
                    ? "opacity-0 hover:opacity-100"
                    : "opacity-100"
                }`}
              >
                {isModalVideoPlaying ? (
                  <Pause className="w-16 h-16 text-white" />
                ) : (
                  <Play className="w-16 h-16 text-white" />
                )}
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
