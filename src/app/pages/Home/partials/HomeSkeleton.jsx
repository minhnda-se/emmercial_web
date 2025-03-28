import React from "react";

export default function HomeSkeleton() {
  return (
    <>
      <div className="flex flex-col justify-between fixed bottom-2 right-2 bg-primary rounded-lg p-4 w-20 h-25">
        <button className="btn btn-ghost text-white h-1/2" aria-label="Message">
          Message
        </button>
        <button className="btn btn-ghost text-white h-1/2" aria-label="Support">
          Support
        </button>
      </div>

      <div className="home_container flex ">
        <div className="home_sidebar rounded-lg bg-white !sticky top-2 h-screen overflow-y-auto custom-scrollbar">
          <SideBar />
        </div>
        <div className="home_body flex flex-col gap-6 p-4">
          <div className="h-80 bg-white rounded-lg shadow-md">
            <h2>Featured Content</h2>
            <p>Some content here...</p>
          </div>
          <div className="h-20 bg-white rounded-lg shadow-md"></div>
          <div className="h-80 bg-white rounded-lg shadow-md"></div>
          <div className="h-80 bg-white rounded-lg shadow-md"></div>
          <div className="h-80 bg-white rounded-lg shadow-md"></div>
          <div className="h-80 bg-white rounded-lg shadow-md"></div>
          <div className="h-80 bg-white rounded-lg shadow-md"></div>
          <div className="h-80 bg-white rounded-lg shadow-md"></div>
        </div>
      </div>
    </>
  );
}
