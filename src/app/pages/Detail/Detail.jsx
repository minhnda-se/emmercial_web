import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import { useLocation, useSearchParams } from "react-router-dom";

// Configurable Options component with memoization
const ConfigurableOptions = React.memo(
  ({ productData, selectedSpid, onVariantSelect }) => {
    // Use useMemo to avoid recalculating options on every render
    const { colorOptions, sizeOptions, selectedColor, selectedSize } =
      useMemo(() => {
        // Get unique color options (option1) from configurable products
        const getUniqueColors = () => {
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
        const getUniqueSizes = () => {
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

        // Get selected color and size based on selectedSpid
        const getSelected = () => {
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

        const colorOptions = getUniqueColors();
        const sizeOptions = getUniqueSizes();
        const { color, size } = getSelected();

        return {
          colorOptions,
          sizeOptions,
          selectedColor: color,
          selectedSize: size,
        };
      }, [productData, selectedSpid]);

    // Helper function to find product based on color and size
    const findProductByOptions = useCallback(
      (color, size) => {
        if (!productData?.configurable_products) return null;

        return productData.configurable_products.find(
          (product) => product.option1 === color && product.option2 === size
        );
      },
      [productData]
    );

    // Render color options
    const renderColorOptions = () => {
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
                  if (option.color === selectedColor) return; // Skip if already selected

                  // Find product with this color and current selected size
                  const product =
                    findProductByOptions(option.color, selectedSize) ||
                    // Or select first product with this color
                    productData.configurable_products.find(
                      (p) => p.option1 === option.color
                    );

                  if (product) {
                    onVariantSelect(product.id, product);
                  }
                }}
                className={`flex items-center border rounded-lg !py-2 !px-1 cursor-pointer transition-all ${
                  selectedColor === option.color
                    ? "border-red-500 bg-red-50 text-red-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center">
                  {showImages && (
                    <img
                      src={option.thumbnail}
                      alt={option.color}
                      className="w-10 h-10 object-cover !mr-2"
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
      const option2Config = productData?.configurable_options?.find(
        (option) => option.code === "option2"
      );
      const showImages = option2Config?.show_preview_image;

      if (!sizeOptions.length) return null;

      return (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((option) => {
              // Find product with current color and this size
              const product = findProductByOptions(selectedColor, option.size);
              const isAvailable = !!product;

              return (
                <div
                  key={option.size}
                  onClick={() => {
                    if (isAvailable && option.size !== selectedSize) {
                      // Skip if already selected
                      onVariantSelect(product.id, product);
                    }
                  }}
                  className={`${
                    showImages ? "flex items-center" : ""
                  } border rounded-lg !px-4 !py-2 ${
                    !showImages ? "text-center" : ""
                  } transition-all ${
                    !isAvailable
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : selectedSize === option.size
                      ? "border-red-500 bg-red-50 text-red-500 cursor-pointer"
                      : "border-gray-300 hover:border-gray-400 cursor-pointer"
                  }`}
                >
                  {showImages && product && (
                    <img
                      src={product.thumbnail_url}
                      alt={option.size}
                      className="w-10 h-10 object-cover !mr-2"
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

    if (!productData?.configurable_options) return null;

    // Sort options based on position field
    const sortedOptions = [...productData.configurable_options].sort(
      (a, b) => a.position - b.position
    );

    return (
      <>
        {sortedOptions.map((option) => {
          switch (option.code) {
            case "option1":
              return (
                <div key={option.code} className="mt-4">
                  <h3 className="text-lg font-medium !mb-2">{option.name}</h3>
                  {renderColorOptions()}
                </div>
              );
            case "option2":
              return (
                <div key={option.code} className="!mt-4">
                  <h3 className="text-lg font-medium !mb-2">{option.name}</h3>
                  {renderSizeOptions()}
                </div>
              );
            default:
              return null;
          }
        })}
      </>
    );
  }
);

// Product Description component
const ProductDescription = React.memo(({ description }) => {
  const [isFullDescriptionVisible, setIsFullDescriptionVisible] =
    useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md !px-3 !py-5 flex flex-col gap-2">
      <h2 className="text-xl font-semibold text-gray-800 !mb-4">
        Mô tả sản phẩm
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          overflow: "hidden",
          height: isFullDescriptionVisible ? "auto" : "250px",
        }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(description || ""),
        }}
      />
      <a
        className="seemore text-red-500 cursor-pointer text-center"
        onClick={() => setIsFullDescriptionVisible(!isFullDescriptionVisible)}
      >
        {isFullDescriptionVisible ? "Thu gọn" : "Xem thêm"}
      </a>
    </div>
  );
});

// Function to fetch data from API based on spid
const fetchVariantData = async (productId, spid) => {
  try {
    const apiUrl = `https://tiki.vn/api/v2/products/${productId}?platform=web${
      spid ? `&spid=${spid}` : ""
    }&version=3#`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch product data");
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
};

// Cache for variant data
const variantCache = new Map();

export default function Detail({}) {
  const [searchParams] = useSearchParams(); // Get query parameters
  const location = useLocation(); // Get the location object (includes state)

  // Access `spid` from the query parameters
  const spid = searchParams.get("spid"); // Provide a default if `spid` is missing

  // Access `productId` from the location state
  const productId = location.state?.productId;
  console.log(productId, spid);
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSpid, setSelectedSpid] = useState(spid);
  const [variantsData, setVariantsData] = useState({});

  // Fetch initial product data - only run once
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchVariantData(productId, spid);
        setProductData(data);

        // Initialize variants data with the first variant
        const initialVariants = { [spid]: data };
        setVariantsData(initialVariants);

        // Cache the data
        variantCache.set(spid, data);

        // Find the initial spid from data
        let initialSpid = spid;
        if (data?.configurable_products) {
          const spidExists = data.configurable_products.some(
            (p) => p.id === spid
          );
          if (!spidExists) {
            const defaultProduct =
              data.configurable_products.find((p) => p.selected) ||
              data.configurable_products[0];
            initialSpid = defaultProduct?.id || spid;

            // If we're using a different initial spid, we need to fetch that data too
            if (initialSpid !== spid) {
              const variantData = await fetchVariantData(
                productId,
                initialSpid
              );
              setVariantsData((prev) => ({
                ...prev,
                [initialSpid]: variantData,
              }));
              variantCache.set(initialSpid, variantData);
            }
          }
        }
        setSelectedSpid(initialSpid);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [productId, spid]); // Only depend on initial props

  // Pre-fetch all variants data in the background after initial load
  useEffect(() => {
    const prefetchVariants = async () => {
      if (
        !productData?.configurable_products ||
        productData.configurable_products.length <= 1
      ) {
        return; // No need to prefetch if there are no variants or only one
      }

      // Create a queue of variants to fetch, excluding already cached ones
      const queue = productData.configurable_products
        .filter(
          (product) =>
            product.id !== selectedSpid && !variantCache.has(product.id)
        )
        .map((product) => product.id);

      for (const variantSpid of queue) {
        try {
          // Check if already cached first
          if (variantCache.has(variantSpid)) continue;

          // Low priority fetch - don't block the UI
          const data = await fetchVariantData(productId, variantSpid);

          // Update cache and state
          variantCache.set(variantSpid, data);
          setVariantsData((prev) => ({ ...prev, [variantSpid]: data }));
        } catch (error) {
          console.error(`Failed to prefetch variant ${variantSpid}:`, error);
          // Continue with other variants even if one fails
        }
      }
    };

    if (!isLoading && productData) {
      prefetchVariants();
    }
  }, [isLoading, productData, productId, selectedSpid]);

  // This is the handler for variant selection - optimized to avoid ANY loading
  const handleVariantSelect = useCallback(
    async (optionSpid, selectedProduct) => {
      // Skip if already selected
      if (optionSpid === selectedSpid) return;

      try {
        // First, update the UI immediately using cached data if available
        // This ensures there's no loading state shown to the user
        setSelectedSpid(optionSpid);

        // Use cached data if available or preliminary data from the product list
        const cachedData = variantCache.get(optionSpid);

        if (cachedData) {
          // Use the fully cached data
          setVariantsData((prev) => ({ ...prev, [optionSpid]: cachedData }));
        } else if (selectedProduct) {
          // Create a preliminary data object based on the current product and selected variant
          // This allows us to update the UI immediately with what we know
          const preliminaryData = {
            ...productData,
            name: selectedProduct.name || productData.name,
            thumbnail_url: selectedProduct.thumbnail_url,
            option1: selectedProduct.option1,
            option2: selectedProduct.option2,
            price: selectedProduct.price,
            list_price: selectedProduct.list_price,
            discount: selectedProduct.discount,
            discount_rate: selectedProduct.discount_rate,
            // Keep other fields from the main product temporarily
          };

          // Update UI immediately with what we know
          setVariantsData((prev) => ({
            ...prev,
            [optionSpid]: preliminaryData,
          }));
        }

        // Then fetch the real data in the background if not cached
        if (!cachedData) {
          const newVariantData = await fetchVariantData(productId, optionSpid);

          // Update cache and state with complete data
          variantCache.set(optionSpid, newVariantData);
          setVariantsData((prev) => ({
            ...prev,
            [optionSpid]: newVariantData,
          }));
        }
      } catch (err) {
        setError(err.message);
      }
    },
    [productId, productData, selectedSpid]
  );

  // Get the current variant data to display
  const currentVariantData = variantsData[selectedSpid] || productData;

  // Show full page loading only on initial load
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  console.log("current", currentVariantData);
  return (
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
                  <DetailPng data={currentVariantData} spid={selectedSpid} />
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="detail_body flex flex-col gap-6 flex-1">
              <div className="bg-white rounded-lg shadow-md !p-4 flex flex-col !gap-4">
                <BasicInfo productData={currentVariantData} />

                {/* ConfigurableOptions component */}
                <ConfigurableOptions
                  productData={productData} // Need original productData for all options
                  selectedSpid={selectedSpid}
                  onVariantSelect={handleVariantSelect}
                />
              </div>

              {currentVariantData?.specifications?.length > 0 && (
                <div className="bg-white rounded-lg shadow-md !p-3">
                  <DetailInfo productData={currentVariantData} />
                </div>
              )}
              {currentVariantData?.installment_info_v3 != null ? (
                <div className="bg-white rounded-lg shadow-md !px-3 !py-5 flex flex-col justify-around !gap-4">
                  <InstallmentServices
                    productData={currentVariantData}
                    productId={productId}
                    spid={selectedSpid}
                  />
                </div>
              ) : (
                <></>
              )}
              {currentVariantData?.warranty_info != null ||
              currentVariantData?.warranty_info.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md !px-3 !py-5 flex flex-col justify-around !gap-4">
                  <WarrantyInfo productData={currentVariantData} />
                </div>
              ) : (
                <></>
              )}

              <div className="bg-white rounded-lg shadow-md !px-3 !py-5 flex flex-col justify-around !gap-4">
                <ShoppingBenefits productData={currentVariantData} />
              </div>

              <ProductDescription
                description={currentVariantData?.description}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <ProductReviews productId={productId} spid={selectedSpid} />
          </div>
        </div>
        {/* Payment Sidebar */}
        <div>
          <div className="detail_sidebar rounded-lg bg-white !sticky top-0 h-screen overflow-y-auto custom-scrollbar">
            <PaymentComponent
              mpid={productId}
              spid={selectedSpid}
              productData={currentVariantData}
            />
          </div>
        </div>
      </div>
    </>
  );
}
