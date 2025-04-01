import React from "react";
import "./Loading.css";

export default function Loading() {
  return (
    <div className="loading-icon">
      <img src="public/Loading icon.png" alt="Loading" />
      <h1 className="loading-text">
        <span className="p1">Loading</span>
        <span className="p2 dot">.</span>
        <span className="p2 dot">.</span>
        <span className="p2 dot">.</span>
      </h1>
    </div>
  );
}
