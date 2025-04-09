import React from "react";
import Loading from "../../../components/Loading";
import { MessageOutlined, CustomerServiceOutlined } from "@ant-design/icons";

export default function HomeSkeleton() {
  const categories = Array(20).fill("Category");
  const content = Array(3).fill("Content");
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

      <div className="home_container flex  ">
        <div className="home_sidebar rounded-lg bg-white !sticky top-2 h-screen overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-y-2 !p-4">
            <h3 className="skeleton"></h3>
            {categories.map((category, index) => (
              <button
                key={index}
                className="btn  flex justify-start !px-2 skeleton"
              ></button>
            ))}
          </div>
        </div>
        <div className="home_body flex flex-col gap-6 p-4">
          <div className="h-80 bg-white rounded-lg shadow-md skeleton">
            {/* <Loading /> */}
          </div>
          {/* <div className="h-20 bg-white rounded-lg shadow-md">
            <Loading />
          </div> */}
          {content.map((item, index) => (
            <div
              key={index}
              className="h-80 bg-white rounded-lg shadow-md skeleton"
            >
              {/* <Loading /> */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
