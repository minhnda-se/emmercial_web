import React from "react";
import { Carousel } from "antd";
export const Banner = (props) => {
  const banner = props.banner.data[0].banners;
  return (
    <>
      <Carousel
        arrows
        infinite={true}
        autoplay={{ dotDuration: true }}
        autoplaySpeed={5000}
        style={{ width: "100%", height: "100%" }}
        className="rounded-lg"
      >
        {banner.map((item) => (
          <div key={item.id}>
            <img
              src={item.image_url}
              alt={item.title}
              style={{ width: "100%", height: "280px" }}
              className="rounded-lg"
            />
          </div>
        ))}
      </Carousel>
      <br />
    </>
  );
};
