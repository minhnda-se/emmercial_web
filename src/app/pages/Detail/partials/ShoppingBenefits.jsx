import React from "react";

const ShoppingBenefits = ({ productData }) => {
  const benefits = productData.benefits;
  if (!benefits || benefits.length === 0) return null;

  return (
    <div className="py-4">
      <div className="text-lg font-medium !mb-2">An tâm mua sắm</div>
      <div className="flex flex-col gap-3">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex items-start border-b border-gray-200 !pb-2"
          >
            <img src={benefit.icon} alt="" className="w-5 h-5 !mt-1 !mr-3" />
            <div>
              <div
                dangerouslySetInnerHTML={{ __html: benefit.text }}
                className="text-sm"
              />
              {benefit.cta && (
                <span
                  className="text-gray-600 cursor-pointer text-sm underline hover:text-red-500"
                  onClick={() => {
                    if (benefit.cta.type === "open_policy_return_modal") {
                      // Handle opening modal logic here
                      console.log("Opening return policy modal");
                    }
                  }}
                >
                  {benefit.cta.text}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoppingBenefits;
