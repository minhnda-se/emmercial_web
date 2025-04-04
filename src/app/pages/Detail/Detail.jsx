import React, { useEffect, useState } from "react";
import DetailPng from "../../components/DetailPng";
import Loading from "../../components/Loading";
import { MessageOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import "./Detail.css";
import { BasicInfo } from "./partials/BasicInfo";
import { DetailInfo } from "./partials/DetailInfo";

export default function Detail({ productId = "275618846", spid = "" }) {
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSpid, setSelectedSpid] = useState(spid);

  // Function to fetch product data
  const fetchProductImages = async () => {
    try {
      setIsLoading(true); // Start loading
      const response = await fetch(
        `https://tiki.vn/api/v2/products/${productId}?platform=web&spid=${selectedSpid}&version=3#`
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

  // Fetch product images when the component mounts or selectedSpid changes
  useEffect(() => {
    fetchProductImages();
  }, [productId, selectedSpid]); // Refetch if productId or selectedSpid changes

  // Handle color option selection
  const handleColorSelect = (optionSpid) => {
    setSelectedSpid(optionSpid);
  };

  // Render color options
  const renderColorOptions = () => {
    if (!productData || !productData.configurable_products) return null;

    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Màu</h3>
        <div className="flex flex-wrap gap-2">
          {productData.configurable_products.map((option) => (
            <div
              key={option.id}
              onClick={() => handleColorSelect(option.id)}
              className={`flex items-center border rounded-lg p-2 cursor-pointer transition-all ${
                selectedSpid === option.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center">
                <img
                  src={option.thumbnail_url}
                  alt={option.option1}
                  className="w-10 h-10 object-cover mr-2"
                />
                <span>{option.option1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
          <div className="detail_container flex gap-4">
            <div className="flex gap-4">
              {/* Sidebar with Product Image */}
              <div>
                <div className="detail_sidebar rounded-lg bg-white !sticky top-0 h-screen overflow-y-auto custom-scrollbar">
                  <div className="flex flex-col gap-y-2 !p-4">
                    {/* Fix: Pass selectedSpid as a prop directly */}
                    <DetailPng data={productData} spid={selectedSpid} />
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="detail_body flex flex-col gap-6 p-4 flex-1">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <BasicInfo productData={productData} />
                  {renderColorOptions()}
                </div>

                {/* Changed this div to properly contain the DetailInfo component */}
                <div className="bg-white rounded-lg shadow-md">
                  <DetailInfo productData={productData} />
                </div>

                <div className="bg-white rounded-lg shadow-md !px-3 !py-5 flex flex-col justify-around !gap-4">
                  {/* Add product header and content */}
                  <div className="flex justify-between">
                    <h2>{productData?.name}</h2>
                    {/* Add more header content here */}
                  </div>

                  {/* Add product description or additional details */}
                  <div>
                    <p
                      style={{
                        whiteSpace: "pre-wrap",
                        overflowWrap: "break-word",
                      }}
                    >
                      {productData?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories Sidebar */}
            <div>
              <div className="detail_sidebar rounded-lg bg-white !sticky top-0 h-screen overflow-y-auto custom-scrollbar">
                <div className="flex flex-col gap-y-2 !p-4">
                  <h3>Categories</h3>
                  {/* Add categories or related content */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
