import React, { use, useEffect, useState } from "react";
import DetailPng from "../../components/DetailPng";

import { sProductData } from "./Detail.store";
import HomeSkeleton from "../Home/partials/HomeSkeleton";
import Loading from "../../components/Loading";
import { MessageOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import "./Detail.css";

export default function Detail({ productId = "113568856", spid = "" }) {
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchProductImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://tiki.vn/api/v2/products/${productId}?platform=web&spid=${spid}&version=3#`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product data");
      }

      const data = await response.json(); // Added await here
      console.log(data);

      setData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      // Set loading to false after the fetch is complete
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    fetchProductImages();
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-col justify-between fixed bottom-2 right-2 bg-secondary rounded-lg p-4 w-20 h-30 z-10">
            <button
              className="btn flex flex-col btn-ghost text-white h-1/2"
              aria-label="Message"
            >
              <MessageOutlined style={{ fontSize: "24px" }} />
              Message
            </button>
            <div className="border-t border-white"></div>
            <button
              className="btn flex flex-col btn-ghost text-white h-1/2"
              aria-label="Support"
            >
              <CustomerServiceOutlined style={{ fontSize: "24px" }} />
              Support
            </button>
          </div>

          {/* <div>
            <DetailPng />
          </div> */}

          <div className="home_container">
            <div className="home_sidebar rounded-lg bg-white !sticky top-2 h-screen overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-y-2 !p-4">
                <DetailPng data={data} />
              </div>
              {/* <SideBar categories={categories} /> */}
            </div>

            <div className="home_body flex flex-col gap-6 p-4">
              <div className="h-70 bg-white rounded-lg shadow-md ">
                {/* <Banner banner={banner} /> */}
              </div>

              <div className="h-32 bg-white rounded-lg shadow-md flex justify-around items-center"></div>

              <div className=" bg-white rounded-lg shadow-md !px-3 !py-5 flex flex-col justify-around !gap-4">
                {/* Header */}
                <div className="flex justify-between"></div>

                {/* Content    */}
                <div></div>
              </div>
            </div>

            <div className="home_sidebar rounded-lg bg-white !sticky top-2 h-screen overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-y-2 !p-4">
                <h3>Categories</h3>
                {/* <DetailPng /> */}
              </div>
              {/* <SideBar categories={categories} /> */}
            </div>
          </div>
        </>
      )}
    </>
  );
}
