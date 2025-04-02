import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { RatingStar } from "./RatingStar";

export const ProductSlide = ({ data }) => {
  return (
    <>
      {/* Header */}
      <div className="flex justify-between">
        {data.header?.badge ? (
          <img
            src={data?.header?.badge?.icon}
            alt="top-deals-icon"
            style={{
              width: `${data.header?.badge.icon_width}px`,
              height: `${data.header?.badge.icon_height}px`,
            }}
          />
        ) : (
          <h3 className="font-bold text-lg">{data?.header?.title}</h3>
        )}

        <a className="link link-secondary">{data.header?.more_link_text}</a>
      </div>
      <div>
        <Swiper
          modules={[Navigation]} // Enable navigation and pagination features
          slidesPerView={5} // Number of slides visible at a time
          slidesPerGroup={5}
          navigation
          spaceBetween={10}
        >
          {data?.items?.slice(0, 34).map((item, index) => (
            <SwiperSlide key={item.id}>
              <div className="card shadow-sm  border-1 border-zinc-100 home-card">
                <figure className="relative">
                  <img
                    src={item.thumbnail_url}
                    alt="Shoes"
                    className="w-full"
                    style={{
                      width: `${item.thumbnail_width}px`,
                    }}
                  />
                  <img
                    src={item.badges_v3[0].image}
                    alt="Badge"
                    className="absolute top-0 left-0 w-full"
                    style={{
                      width: `${item.thumbnail_width}px`,
                    }}
                  />
                </figure>

                <div className="card-body !mt-3 !p-3 ">
                  <h2 className="card-title text-[12px] h-9 truncate-multiline">
                    {item.name}
                  </h2>
                  <RatingStar rating={item.rating_average} />
                  <div className="h-17 flex flex-col">
                    <h3
                      className={`${
                        item.discount_rate !== 0
                          ? "text-secondary"
                          : "text-black"
                      } font-bold text-[16px]`}
                    >
                      {item.price?.toLocaleString()}
                      <span className="align-super underline text-[14px]">
                        đ
                      </span>
                    </h3>
                    {item.discount_rate !== 0 ? (
                      <div className="flex gap-1 items-start">
                        <div className="badge badge-neutral w-10 h-5 text-[10px] text-white flex justify-center items-center">
                          -{item.discount_rate}%
                        </div>

                        <h3 className="text-[11px] line-through text-gray-500">
                          {item.original_price?.toLocaleString()}

                          <span className="align-super text-[8px]">đ</span>
                        </h3>
                      </div>
                    ) : (
                      <div className="h-5"></div>
                    )}
                    {item.origin && (
                      <p className="text-[10px] !mt-1 truncate-multiline h-2">
                        Made in {item.origin}
                      </p>
                    )}
                  </div>
                  <hr className="border-base-200 border-1" />
                  <div className="flex justify-center items-center gap-1">
                    <div
                      className="rounded"
                      style={{
                        width: `${item.badges_new[0].icon_width}px`,
                        height: `${item.badges_new[0].icon_height}px`,
                      }}
                    >
                      <img
                        src={item.badges_new[0].icon}
                        alt="Tailwind-CSS-Avatar-component"
                      />
                    </div>
                    <p className="text-[10px]">{item.badges_new[0].text}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};
