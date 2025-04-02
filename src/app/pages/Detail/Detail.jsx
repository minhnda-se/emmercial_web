import React, { useEffect, useState } from "react";
import DetailPng from "../../components/DetailPng";
import Loading from "../../components/Loading";
import { MessageOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import "./Detail.css";

export default function Detail({ productId = "113568856", spid = "" }) {
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch product data
  const fetchProductImages = async () => {
    try {
      setIsLoading(true); // Start loading
      const response = await fetch(
        `https://tiki.vn/api/v2/products/${productId}?platform=web&spid=${spid}&version=3#`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product data");
      }

      const data = await response.json(); // Wait for the response to be parsed
      setProductData(data); // Set fetched data
    } catch (err) {
      setError(err.message); // Set error if any
    } finally {
      setIsLoading(false); // Set loading to false when the request is done
    }
  };

  // Fetch product images when the component mounts
  useEffect(() => {
    fetchProductImages();
  }, [productId, spid]); // Refetch if productId or spid changes

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <div className="error-message">{error}</div> // Show error message if there's an error
      ) : (
        <>
          {/* Floating buttons for Message and Support */}
          <div className="flex flex-col justify-between fixed bottom-2 right-2 rounded-lg p-4 w-20 h-30 z-10 !gap-0.5">
            <button
              className="btn flex flex-col btn-secondary text-white h-1/2"
              aria-label="Message"
            >
              <MessageOutlined style={{ fontSize: "24px" }} />
              Message
            </button>

            <button
              className="btn flex flex-col btn-secondary text-white h-1/2"
              aria-label="Support"
            >
              <CustomerServiceOutlined style={{ fontSize: "24px" }} />
              Support
            </button>
          </div>

          {/* Main product detail container */}
          <div className="detail_container flex">
            {/* Sidebar with Product Image */}
            <div className="detail_sidebar rounded-lg bg-white !sticky top-2 h-screen overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-y-2 !p-4">
                <DetailPng data={productData} />
              </div>
            </div>

            {/* Main content */}
            <div className="detail_body flex flex-col gap-6 p-4 flex-1">
              <div className="h-70 bg-white rounded-lg shadow-md ">
                {/* Insert Banner or other components here */}
              </div>

              <div className="h-32 bg-white rounded-lg shadow-md flex justify-around items-center">
                {/* Any other content you want */}
              </div>

              <div className="bg-white rounded-lg shadow-md !px-3 !py-5 flex flex-col justify-around !gap-4">
                {/* Add product header and content */}
                <div className="flex justify-between">
                  <h2>{productData?.name}</h2>
                  {/* Add more header content here */}
                </div>

                {/* Add product description or additional details */}
                <div>
                  <p>{productData?.description}</p>
                </div>
              </div>
            </div>

            {/* Categories Sidebar */}
            <div className="detail_sidebar rounded-lg bg-white !sticky top-2 h-screen overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-y-2 !p-4">
                <h3>Categories</h3>
                {/* Add categories or related content */}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
