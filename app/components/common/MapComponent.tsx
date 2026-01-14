"use client";
import React, { useState, useCallback } from "react";
import { MapPin, Navigation, ExternalLink, Clock } from "lucide-react";

interface MapLocation {
  latitude: number;
  longitude: number;
  address: string;
  name: string;
  hours?: string;
}

interface MapComponentProps {
  data: {
    location?: MapLocation;
    map?: {
      embedUrl?: string;
      loadingText?: string;
      errorText?: string;
      errorDescription?: string;
      openMapText?: string;
      directionsText?: string;
    };
    styling?: {
      height?: string;
    };
    controls?: {
      showControls?: boolean;
    };
  };
  className?: string;
}

// Default data
const defaultData = {
  location: {
    latitude: 22.7585315,
    longitude: 75.9054938,
    address: "EB Sector, Scheme No 94 Sector EB, Indore, Madhya Pradesh 452010",
    name: "Our Office",
    hours: "Mon-Fri: 9:00 AM - 6:00 PM IST",
  },
  map: {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14706.96828929718!2d75.9033041697754!3d22.758531499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39631d519c1a5053%3A0x7d50ae04d5b8ae85!2sEB%20Sector%2C%20Scheme%20No%2094%20Sector%20EB%2C%20Indore%2C%20Madhya%20Pradesh%20452010!5e0!3m2!1sen!2sin!4v1698765432100!5m2!1sen!2sin",
    loadingText: "Loading map...",
    errorText: "Map Unavailable",
    errorDescription: "Unable to load the map at this time.",
    openMapText: "Open in Google Maps",
    directionsText: "Directions",
  },
  styling: {
    height: "400px",
  },
  controls: {
    showControls: true,
  },
};

// Helper function to safely access nested properties
const getSafeValue = <T,>(value: T | undefined, defaultValue: T): T => {
  return value ?? defaultValue;
};

export default function MapComponent({
  data,
  className = "",
}: MapComponentProps) {
  // Safely merge data with defaults
  const content = {
    location: { ...defaultData.location, ...data?.location },
    map: {
      embedUrl: getSafeValue(data?.map?.embedUrl, defaultData.map.embedUrl),
      loadingText: getSafeValue(
        data?.map?.loadingText,
        defaultData.map.loadingText
      ),
      errorText: getSafeValue(data?.map?.errorText, defaultData.map.errorText),
      errorDescription: getSafeValue(
        data?.map?.errorDescription,
        defaultData.map.errorDescription
      ),
      openMapText: getSafeValue(
        data?.map?.openMapText,
        defaultData.map.openMapText
      ),
      directionsText: getSafeValue(
        data?.map?.directionsText,
        defaultData.map.directionsText
      ),
    },
    styling: {
      height: getSafeValue(data?.styling?.height, defaultData.styling.height),
    },
    controls: {
      showControls: getSafeValue(
        data?.controls?.showControls,
        defaultData.controls.showControls
      ),
    },
  };

  const [isLoaded, setIsLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Generate URLs based on location data
  const placeUrl = `https://www.google.com/maps/place/${encodeURIComponent(
    content.location.address
  )}/@${content.location.latitude},${content.location.longitude},17z`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${content.location.latitude},${content.location.longitude}`;

  // Event handlers
  const handleMapClick = useCallback(() => {
    window.open(placeUrl, "_blank", "noopener,noreferrer");
  }, [placeUrl]);

  const handleGetDirections = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      window.open(directionsUrl, "_blank", "noopener,noreferrer");
    },
    [directionsUrl]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleMapClick();
      }
    },
    [handleMapClick]
  );

  const handleMapLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleMapError = useCallback(() => {
    setMapError(true);
    setIsLoaded(true);
  }, []);

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 z-10">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-primary-700 font-medium">
          {content.map.loadingText}
        </p>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div
      className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center"
      style={{ height: content.styling.height }}
    >
      <div className="text-center p-8">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {content.map.errorText}
        </h3>
        <p className="text-gray-600 mb-4">{content.map.errorDescription}</p>
        <button
          onClick={handleMapClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <ExternalLink className="w-4 h-4" />
          {content.map.openMapText}
        </button>
      </div>
    </div>
  );

  // Location pin component
  const LocationPin = () => (
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <div className="relative">
        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <div className="absolute inset-0 w-8 h-8 bg-primary-400 rounded-full animate-ping opacity-75" />
      </div>
    </div>
  );

  // Info card component
  const InfoCard = () => (
    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg pointer-events-none">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">
            {content.location.name}
          </h3>
          <p className="text-gray-600 text-xs mb-2">
            {content.location.address}
          </p>
          {content.location.hours && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {content.location.hours}
            </div>
          )}
        </div>
        {content.controls.showControls && (
          <button
            onClick={handleGetDirections}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition-colors flex-shrink-0 ml-2 pointer-events-auto focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Get directions"
          >
            <Navigation className="w-3 h-3" />
            {content.map.directionsText}
          </button>
        )}
      </div>
    </div>
  );

  if (mapError) {
    return <ErrorState />;
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Interactive Map Container */}
      <div
        className="relative overflow-hidden bg-gray-100 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
        style={{ height: content.styling.height }}
        onClick={handleMapClick}
        role="button"
        tabIndex={0}
        aria-label={`View ${content.location.name} on Google Maps`}
        onKeyDown={handleKeyDown}
      >
        {!isLoaded && <LoadingSpinner />}

        {/* Google Maps Embed */}
        <div className="w-full h-full relative">
          <iframe
            src={content.map.embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={handleMapLoad}
            onError={handleMapError}
            title={`Google Maps showing ${content.location.name}`}
            className="absolute inset-0"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <LocationPin />
          <InfoCard />
        </div>
      </div>
      <style jsx>{`
        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes ping {
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
