"use client";

import React, { useState, useEffect } from "react";
import { Quote, Star, ArrowLeft, ArrowRight, Play, Pause } from "lucide-react";

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  videoUrl?: string;
};

export type TestimonialsData = {
  title?: string;
  subtitle?: string;
  description?: string;
  testimonials: Testimonial[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
};

interface TestimonialsSectionProps {
  data: TestimonialsData;
}

const defaultData: TestimonialsData = {
  title: "What Our Clients Say",
  subtitle: "Trusted by industry leaders",
  description:
    "Discover why businesses choose us for their digital transformation journey",
  testimonials: [
    {
      id: "1",
      name: "Sarah Chen",
      role: "CTO",
      company: "TechNova Inc",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      content:
        "Working with this team has been transformative for our business. Their expertise and dedication delivered results beyond our expectations. The platform they built handles our scale perfectly.",
      rating: 5,
      videoUrl: "/videos/testimonial-1.mp4",
    },
    {
      id: "2",
      name: "Marcus Rodriguez",
      role: "Product Director",
      company: "InnovateLabs",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      content:
        "The attention to detail and innovative solutions provided were exceptional. They understood our vision and brought it to life with precision and creativity.",
      rating: 5,
    },
    {
      id: "3",
      name: "Emily Watson",
      role: "CEO",
      company: "StartUpGrid",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      content:
        "Outstanding service from start to finish. The team was responsive, professional, and delivered ahead of schedule. Highly recommended!",
      rating: 5,
    },
    {
      id: "4",
      name: "David Kim",
      role: "Engineering Manager",
      company: "ScaleFast",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      content:
        "The technical expertise and problem-solving skills demonstrated were impressive. They turned our complex requirements into a seamless user experience.",
      rating: 5,
    },
    {
      id: "5",
      name: "Jennifer Lopez",
      role: "Marketing Director",
      company: "BrandBoost",
      avatar:
        "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      content:
        "Exceptional results and outstanding partnership. They truly understand our brand and delivered beyond our expectations.",
      rating: 5,
    },
    {
      id: "6",
      name: "Alex Thompson",
      role: "Operations Manager",
      company: "LogiTech",
      avatar:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      content:
        "Reliable, professional, and consistently delivers high-quality work. A true partner in our success.",
      rating: 5,
    },
  ],
  autoPlay: true,
  autoPlayInterval: 5000,
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const TestimonialCard: React.FC<{
  testimonial: Testimonial;
  isActive: boolean;
  onClick: () => void;
}> = ({ testimonial, isActive, onClick }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const toggleVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!testimonial.videoUrl) return;

    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className={`relative rounded-3xl transition-all duration-500 cursor-pointer ${
        isActive
          ? "bg-linear-to-br from-white to-primary-50 shadow-2xl scale-100 border-2 border-primary-200"
          : "bg-white shadow-lg scale-95 opacity-70 border-2 border-gray-100 hover:scale-98 hover:opacity-90 hover:border-primary-100"
      }`}
      onClick={onClick}
    >
      {/* Quote Icon */}
      <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
        <Quote className="w-6 h-6 text-white" />
      </div>

      <div className="p-8">
        {/* Rating */}
        <div className="mb-4">
          <StarRating rating={testimonial.rating} />
        </div>

        {/* Content */}
        <blockquote className="text-gray-700 leading-relaxed mb-6 line-clamp-4">
          &quot;{testimonial.content}&quot;
        </blockquote>

        {/* Video Player (if available) */}
        {testimonial.videoUrl && isActive && (
          <div className="mb-6 relative rounded-2xl overflow-hidden bg-gray-900">
            <video
              ref={videoRef}
              src={testimonial.videoUrl}
              className="w-full h-32 object-cover"
              poster={testimonial.avatar}
              onEnded={() => setIsPlaying(false)}
            />
            <button
              onClick={toggleVideo}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </button>
          </div>
        )}

        {/* Author Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-linear-to-br from-primary-100 to-primary-200">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-bold text-gray-900">{testimonial.name}</div>
            <div className="text-sm text-primary-600">{testimonial.role}</div>
            <div className="text-sm text-gray-500">{testimonial.company}</div>
          </div>
        </div>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-linear-to-r from-primary-500 to-primary-600 rounded-t-full" />
      )}
    </div>
  );
};

export default function TestimonialsSection({
  data,
}: TestimonialsSectionProps) {
  const {
    title = defaultData.title,
    subtitle = defaultData.subtitle,
    description = defaultData.description,
    testimonials = defaultData.testimonials,
    autoPlay = defaultData.autoPlay,
    autoPlayInterval = defaultData.autoPlayInterval,
  } = data;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length, autoPlayInterval]);

  const nextTestimonial = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex(
      (current) => (current - 1 + testimonials.length) % testimonials.length
    );
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-white">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wide text-primary-700">
              Testimonials
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-xl lg:text-2xl text-primary-600 mb-6">
            {subtitle}
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Main Testimonial Display */}
          <div className="mb-12">
            <TestimonialCard
              testimonial={testimonials[activeIndex]}
              isActive={true}
              onClick={() => {}}
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-6 mb-12">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-2xl bg-white border-2 border-primary-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 hover:border-primary-300 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-200"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="w-5 h-5 text-primary-600" />
            </button>

            {/* Auto-play Toggle */}
            <button
              onClick={toggleAutoPlay}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 ${
                isAutoPlaying
                  ? "bg-primary-500 text-white focus:ring-primary-300"
                  : "bg-white border-2 border-primary-200 text-primary-600 focus:ring-primary-200"
              }`}
              aria-label={isAutoPlaying ? "Pause auto-play" : "Start auto-play"}
            >
              {isAutoPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-2xl bg-white border-2 border-primary-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 hover:border-primary-300 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-200"
              aria-label="Next testimonial"
            >
              <ArrowRight className="w-5 h-5 text-primary-600" />
            </button>
          </div>

          {/* Testimonial Dots */}
          <div className="flex justify-center gap-3 mb-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-200 ${
                  index === activeIndex
                    ? "bg-primary-500 scale-125"
                    : "bg-primary-200 hover:bg-primary-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Additional Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                isActive={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
