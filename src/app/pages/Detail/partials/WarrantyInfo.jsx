import React from "react";
import { useNavigate } from "react-router-dom";

const WarrantyInfo = ({ productData }) => {
  // Check if warranty information exists in productData
  const warrantyInfo = productData?.warranty_info || [];
  const nav = useNavigate();

  // If no warranty info available
  if (!warrantyInfo || warrantyInfo.length === 0) {
    return null;
  }
  console.log("adfsasdf", productData);

  return (
    <div className="warranty-info-section mt-4">
      <h2 className="text-xl font-medium !mb-4">Thông tin bảo hành</h2>
      <div>
        {warrantyInfo.map((item, index) => {
          const hasUrl = !!item.url;

          return (
            <div
              key={item.name}
              className="flex items-center px-4 !py-2 border-b border-gray-200"
            >
              <div className="text-gray-600">{item.name}:</div>
              <div className="flex items-center !ml-2">
                {hasUrl ? (
                  <div
                    onClick={() => {
                      nav("/warrantyInstructions");
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 flex items-center cursor-pointer"
                  >
                    {item.value}
                  </div>
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
