import React from "react";
import "./Loading.css";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col justify-between fixed bottom-2 right-2 bg-primary rounded-lg p-4 w-20 h-30">
        <button
          className="btn btn-ghost text-white h-1/2"
          aria-label="Message"
          disabled
        >
          Message
        </button>
        <div className="border-t border-white"></div>
        <button
          className="btn btn-ghost text-white h-1/2"
          aria-label="Support"
          disabled
        >
          Support
        </button>
      </div>

      <div className="loading-icon">
        <img src="public/Loading icon.png" alt="Loading" />
        <h1 className="loading-text">
          <span className="p1">Loading</span>
          <span className="p2 dot">.</span>
          <span className="p2 dot">.</span>
          <span className="p2 dot">.</span>
        </h1>
      </div>
    </>
  );
}
