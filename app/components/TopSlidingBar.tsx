import React from "react";

export default function TopSlidingBar({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`fixed left-0 right-0 top-0 z-[60] pointer-events-none transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="h-1 w-full overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-primary-500 to-transparent">
          <div
            className="h-full w-[25%] animate-[slide_1.2s_linear_infinite]"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.15) 50%, rgba(0,0,0,0) 100%)",
              transform: "translateX(-100%)",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(220%);
          }
        }
        .animate-\\[slide_1.2s_linear_infinite\\] {
          animation: slide 1.2s linear infinite;
        }
      `}</style>
    </div>
  );
}
