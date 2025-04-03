import React from "react";

export const BasicInfo = ({ productData }) => {
  // Calculate discount percentage
  const discountPercent =
    productData?.discount_rate ||
    Math.round(
      ((productData?.original_price - productData?.price) /
        productData?.original_price) *
        100
    );

  // Format price with comma separators
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Find badge icons from badges_v3 array
  const getBadgeIcon = (code) => {
    const badge = productData?.badges_v3?.find((badge) => badge.code === code);
    return badge?.icon || null;
  };

  // Get icons for specific badges
  const freeshippingIcon = getBadgeIcon("freeship_xtra");
  const returnPolicyIcon = getBadgeIcon("return_policy");
  const authenticIcon = getBadgeIcon("is_authentic");

  return (
    <div className="p-4">
      {/* Badges section */}
      <div className="flex gap-2 mb-3 flex-wrap items-center">
        {freeshippingIcon && (
          <img src={freeshippingIcon} alt="Freeship Xtra" className="h-5" />
        )}

        {returnPolicyIcon && (
          <img src={returnPolicyIcon} alt="Return Policy" className="h-5" />
        )}

        {authenticIcon && (
          <img src={authenticIcon} alt="Authentic" className="h-5" />
        )}

        <span className="text-gray-700 text-xs px-2 py-1 flex items-center">
          Thương hiệu:{" "}
          <span className="text-blue-600 ml-1">{productData?.brand?.name}</span>
        </span>
      </div>

      {/* Product title */}
      <h1 className="text-2xl font-bold mb-1">{productData?.name}</h1>

      {/* Ratings and sold count */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-semibold">{productData?.rating_average}</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-yellow-400">
              {star <= Math.floor(productData?.rating_average)
                ? "★"
                : star - 0.5 <= productData?.rating_average
                ? "★"
                : "☆"}
            </span>
          ))}
        </div>
        <span className="text-gray-500">({productData?.review_count})</span>
        <span className="text-gray-500">|</span>
        <span className="text-gray-500">
          Đã bán {productData?.all_time_quantity_sold}
        </span>
      </div>

      {/* Price section */}
      <div className="mb-2">
        <div className="flex items-end gap-2">
          <span className="text-red-500 text-3xl font-bold">
            {formatPrice(productData?.price)}₫
          </span>
          <span className="text-gray-500 line-through">
            {formatPrice(productData?.original_price)}₫
          </span>
          <span className="bg-red-100 text-red-600 px-1 text-sm">
            -{discountPercent}%
          </span>
        </div>
        <div className="text-gray-500 text-sm mt-1">
          Giá sau áp dụng mã khuyến mãi
        </div>
      </div>

      {/* Coupon info */}
      <div className="flex items-center text-blue-600 text-sm">
        <span className="border border-blue-600 px-1 mr-2">
          <span className="text-xs font-bold">₫</span>
        </span>
        <span>Giảm 20.000₫ từ mã khuyến mãi của Tiki</span>
      </div>
    </div>
  );
};
