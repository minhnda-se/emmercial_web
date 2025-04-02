import React from "react";
import { GetTimeRemain } from "../usecases/getTimeRemain";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export const FlashSale = ({ flashSale }) => {
  return (
    <div className=" bg-white shadow-md !px-3 !py-3 flex flex-col justify-around !gap-4">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex gap-2 justify-center items-center">
          <h2>Flash Sale</h2>
          <GetTimeRemain
            startTime={
              flashSale.data && flashSale.data.length > 0
                ? flashSale.data[0].from_date
                : null
            }
            endTime={flashSale.datetime}
          />
        </div>
        <a className="link link-secondary">Xem tất cả</a>
      </div>
      {/* Content */}
      <div>
        <Swiper
          modules={[Navigation]} // Enable navigation and pagination features
          slidesPerView={5} // Number of slides visible at a time
          slidesPerGroup={5}
          navigation
          spaceBetween={10}
        >
          {flashSale.data.map((item, index) => (
            <SwiperSlide key={item.product.id}>
              <div className="card shadow-sm  border-1 border-zinc-100 home-card items-center gap-2 !py-2 relative">
                <div className="badge badge-primary absolute top-0 left-0 text-sm rounded-lg font-bold !p-2">
                  -{item.product.discount_rate}%
                </div>
                <img src={item.product.thumbnail_url} alt="" />
                <h3
                  className={`${
                    item.product.discount_rate !== 0
                      ? "text-secondary"
                      : "text-black"
                  } font-bold text-[16px]`}
                >
                  {item.product.price?.toLocaleString()}
                  <span className="align-super underline text-[14px]">đ</span>
                </h3>
                <div className="relative w-full">
                  <progress
                    className="progress progress-secondary flex !m-auto h-3"
                    value={item.progress.ordered_percent}
                    max="100"
                    style={{ width: "80%" }}
                  >
                    {item.progress.progress_text}
                  </progress>
                  <div
                    className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-white font-bold"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      fontSize: "10px", // Adjust as needed
                      pointerEvents: "none", // So it doesn't block interaction with the progress bar
                    }}
                  >
                    {item.progress.progress_text}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
