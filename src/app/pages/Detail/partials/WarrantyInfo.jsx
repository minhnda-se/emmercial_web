import React from "react";
import { RightOutlined } from "@ant-design/icons";

const WarrantyInfo = ({ productData }) => {
  // Check if warranty information exists in productData
  const warrantyInfo = productData?.warranty_info || [];

  // If no warranty info available
  if (!warrantyInfo || warrantyInfo.length === 0) {
    return null;
  }

  return (
    <div className="warranty-info-section mt-4">
      <h2 className="text-xl font-medium mb-4">Thông tin bảo hành</h2>
      <div>
        {warrantyInfo.map((item, index) => {
          const hasUrl = !!item.url;

          return (
            <div
              key={item.name}
              className="flex justify-between items-center px-4 py-4"
            >
              <div className="text-gray-600">{item.name}:</div>
              <div className="flex items-center">
                {hasUrl ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 flex items-center"
                  >
                    {item.value}
                    <RightOutlined
                      className="ml-2"
                      style={{ fontSize: "12px" }}
                    />
                  </a>
                ) : (
                  <span className="font-medium">{item.value}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WarrantyInfo;
