// DetailInfo.jsx - Place this in the partials folder
import React from "react";
import DOMPurify from "dompurify";

export const DetailInfo = ({ productData }) => {
  // Check if product data and specifications exist
  if (
    !productData ||
    !productData.specifications ||
    !productData.specifications.length
  ) {
    return (
      <div className="w-full text-center text-gray-500">
        No specification data available
      </div>
    );
  }

  const specifications = productData.specifications;
  const attributes = specifications[0].attributes;

  return (
    <div className="w-full">
      <div className="p-4 bg-white">
        <h2 className="text-xl font-semibold text-gray-800 !mb-2">
          Thông tin chi tiết
        </h2>
        <div className="divide-y divide-gray-200">
          {attributes.map((attribute, index) => (
            <div
              key={attribute.code}
              className={`flex justify-between items-center flex-row py-3 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div className="text-gray-600">{attribute.name}</div>
              <div
                className="w-3/7 font-medium"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(attribute?.value || ""),
                }}
              />
              {/* {renderAttributeValue(attribute.value)} */}
              {/* {attribute.value} */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Function to handle formatting of values with special styling
const renderAttributeValue = (value) => {
  if (!value) return "-";

  // Handle HTML-encoded ampersands
  const decodedValue = value.replace(/&amp;/g, "&");

  // Check if the value contains specific keywords to apply special styling
  if (
    value.includes("Type-C") ||
    value.toLowerCase().includes("bluetooth") ||
    value.toLowerCase().includes("mp") ||
    value.toLowerCase().includes("gb") ||
    value.toLowerCase().includes("ghz")
  ) {
    return <span className="text-blue-600">{decodedValue}</span>;
  }

  return decodedValue;
};
