import React, { useEffect, useState } from "react";
import DetailPng from "../../components/DetailPng";
import Loading from "../../components/Loading";
import { MessageOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import "./Detail.css";
import { BasicInfo } from "./partials/BasicInfo";
import { DetailInfo } from "./partials/DetailInfo";
import DOMPurify from "dompurify";
import ProductReviews from "./partials/ProductReviews";
import PaymentComponent from "./partials/PaymentComponent";
import InstallmentServices from "./partials/InstallmentServices";
import WarrantyInfo from "./partials/WarrantyInfo";
import ShoppingBenefits from "./partials/ShoppingBenefits";

export default function Detail({
  productId = "274101255",
  spid = "274101974",
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSpid, setSelectedSpid] = useState(spid);
  const [isFullDescriptionVisible, setIsFullDescriptionVisible] =
    useState(false);

  // Function to fetch product data
  const fetchProductImages = async () => {
    try {
      setIsLoading(true); // Start loading
      // Modify URL to handle empty spid
      const apiUrl = `https://tiki.vn/api/v2/products/${productId}?platform=web${
        selectedSpid ? `&spid=${selectedSpid}` : ""
      }&version=3#`;

      const response = await fetch(apiUrl);

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

  // Set correct selectedSpid based on the provided spid once product data is loaded
  useEffect(() => {
    if (productData?.configurable_products) {
      // If spid is provided, check if it exists in configurable_products
      if (spid) {
        const productExists = productData.configurable_products.some(
          (product) => product.id === spid
        );

        if (productExists) {
          setSelectedSpid(spid);
        } else {
          // If spid doesn't exist, find product with selected=true or use first product
          const defaultProduct =
            productData.configurable_products.find((p) => p.selected) ||
            productData.configurable_products[0];
          setSelectedSpid(defaultProduct?.id);
        }
      } else {
        // If no spid is provided, find product with selected=true or use first product
        const defaultProduct =
          productData.configurable_products.find((p) => p.selected) ||
          productData.configurable_products[0];
        setSelectedSpid(defaultProduct?.id);
      }
    }
  }, [productData, spid]);

  // Handle variant selection
  const handleVariantSelect = (optionSpid) => {
    setSelectedSpid(optionSpid);
  };

  // Get unique color options (option1) from configurable products
  const getColorOptions = () => {
    if (!productData?.configurable_products) return [];

    const uniqueColors = new Set();
    const colorOptions = [];

    productData.configurable_products.forEach((option) => {
      if (!uniqueColors.has(option.option1)) {
        uniqueColors.add(option.option1);
        colorOptions.push({
          color: option.option1,
          thumbnail: option.thumbnail_url,
          spid: option.id,
        });
      }
    });

    return colorOptions;
  };

  // Get unique size options (option2) from configurable products
  const getSizeOptions = () => {
    if (!productData?.configurable_products) return [];

    const uniqueSizes = new Set();
    const sizeOptions = [];

    productData.configurable_products.forEach((option) => {
      if (!uniqueSizes.has(option.option2)) {
        uniqueSizes.add(option.option2);
        sizeOptions.push({
          size: option.option2,
          spid: option.id,
          thumbnail: option.thumbnail_url,
        });
      }
    });

    return sizeOptions;
  };

  // Get currently selected color and size
  const getSelectedOptions = () => {
    if (!productData?.configurable_products || !selectedSpid)
      return { color: "", size: "" };

    const selectedProduct = productData.configurable_products.find(
      (option) => option.id === selectedSpid
    );

    return {
      color: selectedProduct?.option1 || "",
      size: selectedProduct?.option2 || "",
    };
  };

  // Find product by color and size
  const findProductByOptions = (color, size) => {
    if (!productData?.configurable_products) return null;

    return productData.configurable_products.find(
      (product) => product.option1 === color && product.option2 === size
    );
  };

  // Render color options
  const renderColorOptions = () => {
    const colorOptions = getColorOptions();
    const { color: selectedColor } = getSelectedOptions();
    const option1Config = productData?.configurable_options?.find(
      (option) => option.code === "option1"
    );
    const showImages = option1Config?.show_preview_image;

    if (!colorOptions.length) return null;

    return (
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((option) => (
            <div
              key={option.color}
              onClick={() => {
                // Find a product with this color and currently selected size
                const { size } = getSelectedOptions();
                const product =
                  findProductByOptions(option.color, size) ||
                  // Or just select the first product with this color
                  productData.configurable_products.find(
                    (p) => p.option1 === option.color
                  );

                if (product) {
                  handleVariantSelect(product.id);
                }
              }}
              className={`flex items-center border rounded-lg p-2 cursor-pointer transition-all ${
                selectedColor === option.color
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center">
                {showImages && (
                  <img
                    src={option.thumbnail}
                    alt={option.color}
                    className="w-10 h-10 object-cover mr-2"
                  />
                )}
                <span>{option.color}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render size options
  const renderSizeOptions = () => {
    const sizeOptions = getSizeOptions();
    const { size: selectedSize, color: selectedColor } = getSelectedOptions();
    const option2Config = productData?.configurable_options?.find(
      (option) => option.code === "option2"
    );
    const showImages = option2Config?.show_preview_image;

    if (!sizeOptions.length) return null;

    return (
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((option) => {
            // Find a product with currently selected color and this size
            const product = findProductByOptions(selectedColor, option.size);
            const isAvailable = !!product;

            return (
              <div
                key={option.size}
                onClick={() => {
                  if (isAvailable) {
                    handleVariantSelect(product.id);
                  }
                }}
                className={`${
                  showImages ? "flex items-center" : ""
                } border rounded-lg px-4 py-2 ${
                  !showImages ? "text-center" : ""
                } transition-all ${
                  !isAvailable
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : selectedSize === option.size
                    ? "border-blue-500 bg-blue-50 cursor-pointer"
                    : "border-gray-300 hover:border-gray-400 cursor-pointer"
                }`}
              >
                {showImages && product && (
                  <img
                    src={product.thumbnail_url}
                    alt={option.size}
                    className="w-10 h-10 object-cover mr-2"
                  />
                )}
                <span>{option.size}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderConfigurableOptions = () => {
    if (!productData?.configurable_options) return null;

    // Sort options based on position field
    const sortedOptions = [...productData.configurable_options].sort(
      (a, b) => a.position - b.position
    );

    return sortedOptions.map((option) => {
      switch (option.code) {
        case "option1":
          return (
            <div key={option.code} className="mt-4">
              <h3 className="text-lg font-medium mb-2">{option.name}</h3>
              {renderColorOptions()}
            </div>
          );
        case "option2":
          return (
            <div key={option.code} className="mt-4">
              <h3 className="text-lg font-medium mb-2">{option.name}</h3>
              {renderSizeOptions()}
            </div>
          );
        default:
          return null;
      }
    });
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
            <div>
              <div className="flex gap-4">
                {/* Sidebar with Product Image */}
                <div>
                  <div className="detail_sidebar rounded-lg shadow-md bg-white !sticky top-0 h-screen overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col gap-y-2 !p-4">
                      <DetailPng data={productData} spid={selectedSpid} />
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="detail_body flex flex-col gap-6 flex-1">
                  <div className="bg-white rounded-lg shadow-md !p-4 flex flex-col !gap-4">
                    <BasicInfo productData={productData} />
                    {renderConfigurableOptions()}
                  </div>

                  {/* Changed this div to properly contain the DetailInfo component */}
                  {productData?.specifications?.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md !p-3">
                      <DetailInfo productData={productData} />
                    </div>
                  ) : (
                    // If no specifications, show a message or alternative content
                    <></>
                  )}

                  <div className="bg-white rounded-lg shadow-md !px-3 !py-5 flex flex-col justify-around !gap-4">
                    {/* Add product header and content */}
                    <div className="flex justify-between">
                      {/* Add more header content here */}
                    </div>
                    <InstallmentServices
                      productData={productData}
                      productId={productId}
                      spid={selectedSpid}
                    />
                  </div>

                  {!productData?.warranty_info ||
                  productData?.warranty_info == [] ? (
                    <div className="bg-white rounded-lg shadow-md !px-3 !py-5 flex flex-col justify-around !gap-4">
                      {/* Add product header and content */}
                      <div className="flex justify-between">
                        {/* Add more header content here */}
                      </div>
                      <WarrantyInfo productData={productData} />
                    </div>
                  ) : (
                    <></>
                  )}

                  <div className="bg-white rounded-lg shadow-md !px-3 !py-5 flex flex-col justify-around !gap-4">
                    {/* Add product header and content */}
                    <div className="flex justify-between">
                      {/* Add more header content here */}
                    </div>
                    <ShoppingBenefits productData={productData} />
                  </div>

                  <div className="bg-white rounded-lg shadow-md !px-3 !py-5 flex flex-col gap-2">
                    {/* Add product header and content */}
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Mô tả sản phẩm
                    </h2>
                    {/* Add more header content here */}

                    {/* Add product description or additional details */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        overflow: "hidden",
                        height: isFullDescriptionVisible ? "auto" : "250px",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          productData?.description || ""
                        ),
                      }}
                    />
                    <a
                      className="seemore text-blue-500 cursor-pointer text-center"
                      onClick={() =>
                        setIsFullDescriptionVisible(!isFullDescriptionVisible)
                      }
                    >
                      {isFullDescriptionVisible ? "Thu gọn" : "Xem thêm"}
                    </a>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md">
                <ProductReviews productId={productId} spid={selectedSpid} />
              </div>
            </div>

            {/* Categories Sidebar */}
            <div>
              <div className="detail_sidebar rounded-lg shadow-md bg-white !sticky top-0 h-screen overflow-y-auto custom-scrollbar">
                <div className="flex flex-col gap-y-2 !p-4">
                  <PaymentComponent mpid={productId} spid={selectedSpid} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
