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
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Thông tin chi tiết
        </h2>
        <div className="divide-y divide-gray-200">
          {attributes.map((attribute, index) => (
            <div
              key={attribute.code}
              className={`flex flex-row py-3 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div className="w-1/2 text-gray-600">{attribute.name}</div>
              <div
                className="w-1/2 font-medium"
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
