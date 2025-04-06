import React from "react";
import { Link } from "react-router-dom";

const InstallmentServices = ({ productData, productId, spid }) => {
  // Kiểm tra nếu không có dữ liệu hoặc dữ liệu không có trường installment_info_v3
  if (
    !productData ||
    !productData.installment_info_v3 ||
    productData.installment_info_v3.length === 0
  ) {
    return null;
  }

  // Function để xử lý URL, thay thế masterId và spid nếu cần
  const processUrl = (url) => {
    if (!url) return "#";

    // Thay thế masterId và spid trong URL nếu có
    let processedUrl = url;
    if (url.includes("masterId=") && productId) {
      processedUrl = processedUrl.replace(
        /masterId=\d+/,
        `masterId=${productId}`
      );
    }

    if (url.includes("spid=") && spid) {
      processedUrl = processedUrl.replace(/spid=\d+/, `spid=${spid}`);
    }

    return processedUrl;
  };

  return (
    <div className="installment-services p-4">
      <h3 className="text-lg font-medium mb-3">Dịch vụ bổ sung</h3>
      <div className="flex flex-col">
        {productData.installment_info_v3.map((service, index) => (
          <Link
            key={index}
            to={processUrl(service.url)}
            className="flex items-center p-3 hover:bg-gray-50 transition-all"
          >
            <div className="flex-shrink-0 mr-3">
              {service.icon && (
                <img
                  src={service.icon}
                  alt={service.title}
                  className="w-8 h-8 object-contain"
                />
              )}
            </div>
            <div className="flex-grow">
              <div
                className="font-medium"
                dangerouslySetInnerHTML={{
                  __html: service.display_text || service.title,
                }}
              />
              {service.summary && (
                <div className="text-sm text-gray-500">{service.summary}</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InstallmentServices;
