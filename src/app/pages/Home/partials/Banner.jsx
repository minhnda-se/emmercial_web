import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
export const Banner = (props) => {
  const banner =
    Array.isArray(props?.banner?.data) && props.banner.data.length > 0
      ? props.banner.data[0].banners
      : [];
  return (
    <>
      <Swiper
        modules={[Navigation, Autoplay, Pagination]} // Enable navigation and pagination features
        slidesPerView={2} // Number of slides visible at a time
        slidesPerGroup={2}
        navigation
        loop={true} // Enable loop for infinite scrolling
        pagination={{ clickable: true }}
        spaceBetween={5}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        style={{ height: "100%", width: "100%" }}
      >
        {banner.map((item, index) => (
          <SwiperSlide key={index}>
            <img
              src={item.image_url}
              alt={item.title}
              className="rounded-lg"
              style={{ height: "100%", width: "100%" }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};
