import React from "react";
import { RatingStar } from "../../Home/partials/RatingStar";

export const Product = ({ productsList }) => {
  if (!productsList || productsList.length === 0) {
    return <p>No products available</p>;
  }

  return (
    <div className="w-[100%] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 rounded-lg">
      {productsList.map((item, index) => (
        <div
          key={item.id + index}
          id={`product-${item.id}`}
          className="card shadow-sm border-1 border-zinc-100 home-card"
        >
          <figure className="relative">
            <img
              src={item?.thumbnail_url}
              alt={item?.name || "Product image"}
              className="w-full"
              style={{
                width: `${item?.thumbnail_width}px`,
              }}
            />
            {item?.badges_v3 &&
              item?.badges_v3.length > 0 &&
              item?.badges_v3[0]?.image && (
                <img
                  src={item?.badges_v3[0]?.image}
                  alt="Badge"
                  className="absolute top-0 left-0 w-full"
                  style={{
                    width: `${item?.thumbnail_width}px`,
                  }}
                />
              )}
          </figure>

          <div className="card-body !p-3 bg-white rounded-b-lg">
            <h2 className="card-title text-[12px] h-9 truncate-multiline">
              {item?.name}
            </h2>
            <RatingStar rating={item?.rating_average} />
            <div className="h-17 flex flex-col">
              <h3
                className={`${
                  item?.discount_rate !== 0 ? "text-secondary" : "text-black"
                } font-bold text-[16px]`}
              >
                {item?.price?.toLocaleString()}
                <span className="align-super underline text-[14px]">đ</span>
              </h3>
              {item?.discount_rate !== 0 && (
                <div className="flex gap-1 items-start">
                  <div className="badge badge-neutral w-10 h-5 text-[10px] text-white flex justify-center items-center">
                    -{item?.discount_rate}%
                  </div>
                  <h3 className="text-[11px] line-through text-gray-500">
                    {item?.original_price?.toLocaleString()}
                    <span className="align-super text-[8px]">đ</span>
                  </h3>
                </div>
              )}
              {item?.origin && (
                <p className="text-[10px] !mt-1 truncate-multiline h-2">
                  Made in {item?.origin}
                </p>
              )}
            </div>
            <hr className="border-base-200 border-1" />
            {item?.badges_new &&
              item?.badges_new.length > 0 &&
              item?.badges_new[0]?.icon && (
                <div className="flex justify-center items-center gap-1">
                  <div
                    className="rounded"
                    style={{
                      width: `${item?.badges_new[0]?.icon_width}px`,
                      height: `${item?.badges_new[0]?.icon_height}px`,
                    }}
                  >
                    <img src={item?.badges_new[0]?.icon} alt="Badge Icon" />
                  </div>
                  <p className="text-[10px]">{item?.badges_new[0]?.text}</p>
                </div>
              )}
          </div>
        </div>
      ))}
    </div>
  );
};
