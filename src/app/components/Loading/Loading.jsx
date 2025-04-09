import React from "react";
import "./Loading.css";
import { MessageOutlined, CustomerServiceOutlined } from "@ant-design/icons";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col justify-between fixed bottom-2 right-2 rounded-lg p-4 w-20 h-30 !gap-0.5">
        <button
          className="btn flex flex-col btn-primary text-white h-1/2"
          aria-label="Message"
        >
          <MessageOutlined style={{ fontSize: "24px" }} />
          Message
        </button>
        <button
          className="btn flex flex-col btn-primary text-white h-1/2"
          aria-label="Support"
        >
          <CustomerServiceOutlined style={{ fontSize: "24px" }} />
          Support
        </button>
      </div>

      <div className="loading-icon">
        <img src="/public/Loading icon.png" alt="Loading" />
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
