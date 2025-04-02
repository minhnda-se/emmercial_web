import React, { useState, useEffect } from "react";
import { MessageOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import "./Home.css";
import { Carousel } from "antd";
import { SideBar } from "./partials/SideBar";
import HomeSkeleton from "./partials/HomeSkeleton";
import { fetchCategory } from "./services/fetchCategory";
import { fetchBanner } from "./services/fetchBanner";
import { fetchHotDeals } from "./services/fetchHotDeals";
import { fetchTopDeals } from "./services/fetchTopDeals";
import Link from "daisyui/components/link";
import { Banner } from "./usecases/Banner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
const content = [
  { title: "Content 1", description: "Some description here" },
  { title: "Content 2", description: "Another description" },
  { title: "Content 3", description: "More content to display" },
];
const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState({});
  const [banner, setBanner] = useState({});
  const [hotDeals, setHotDeals] = useState({});
  const [topDeals, setTopDeals] = useState({});
  useEffect(() => {
    const categoryData = async () => {
      try {
        const data = await fetchCategory();
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const hotDealsData = async () => {
      try {
        const data = await fetchHotDeals();
        if (data) {
          setHotDeals(data);
        }
      } catch (error) {
        console.error("Error fetching hot deals:", error);
      }
    };
    const topDealsData = async () => {
      try {
        const data = await fetchTopDeals();
        if (data) {
          setTopDeals(data);
          console.log(data);
        }
      } catch (error) {
        console.error("Error fetching hot deals:", error);
      }
    };
    const bannerData = async () => {
      try {
        const data = await fetchBanner();
        if (data) {
          setBanner(data);
          console.log(data);
        }
      } catch (error) {
        console.error("Error fetching banner:", error);
      }
    };

    categoryData();
    hotDealsData();
    topDealsData();
    bannerData();

    // Set a 1-second delay before setting loading state to false
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Cleanup function to clear the timeout if the component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <HomeSkeleton />
      ) : (
        <>
          <div className="flex flex-col justify-between fixed bottom-2 right-2  rounded-lg p-4 w-20 h-30 z-10 !gap-0.5">
            <button
              className="btn flex flex-col btn-secondary text-white h-1/2"
              aria-label="Message"
            >
              <MessageOutlined style={{ fontSize: "24px" }} />
              Message
            </button>
            {/* <div className="border-t border-white"></div> */}
            <button
              className="btn flex flex-col btn-secondary text-white h-1/2"
              aria-label="Support"
            >
              <CustomerServiceOutlined style={{ fontSize: "24px" }} />
              Support
            </button>
          </div>

          <div className="home_container flex">
            <div className="home_sidebar rounded-lg bg-white !sticky top-2 h-screen overflow-y-auto custom-scrollbar">
              <SideBar categories={categories} />
            </div>
            <div className="home_body flex flex-col gap-6 p-4">
              <div className="h-70 bg-white rounded-lg shadow-md ">
                <Banner banner={banner} />
              </div>
              <div className="h-32 bg-white rounded-lg shadow-md flex justify-around items-center">
                {hotDeals?.items?.map((item, index) => (
                  <button
                    key={index}
                    style={{ width: "8%", height: "70%", padding: "auto" }}
                    className="btn-hotdeals flex flex-col items-center"
                  >
                    <div className="avatar ">
                      <div className="w-12 rounded-lg">
                        <img src={item.thumbnail_url} />
                      </div>
                    </div>
                    <p
                      className="text-[12px] text-center text-wrap !mt-2 font-bold"
                      style={{ color: index === 0 && `${item.name_color}` }}
                    >
                      {item.name}
                    </p>
                  </button>
                ))}
              </div>

              <div className=" bg-white rounded-lg shadow-md !px-3 !py-5 flex flex-col justify-around !gap-4">
                {/* Header */}
                <div className="flex justify-between">
                  <img
                    src={topDeals?.header?.badge?.icon}
                    alt="top-deals-icon"
                    style={{
                      width: `${topDeals.header?.badge.icon_width}px`,
                      height: `${topDeals.header?.badge.icon_height}px`,
                    }}
                  />
                  <a className="link link-secondary">
                    {topDeals.header?.more_link_text}
                  </a>
                </div>

                {/* Content    */}
                <div>
                  <Swiper
                    modules={[Navigation]} // Enable navigation and pagination features
                    slidesPerView={5} // Number of slides visible at a time
                    slidesPerGroup={5}
                    navigation
                    spaceBetween={10}
                  >
                    {topDeals?.items?.slice(0, 34).map((item, index) => (
                      <SwiperSlide key={item.id}>
                        <div className="card shadow-sm  border-1 border-zinc-100">
                          <figure>
                            <img
                              src={item.thumbnail_url}
                              alt="Shoes"
                              style={{
                                width: `${item.thumbnail_width}px`,
                              }}
                            />
                          </figure>
                          <div className="card-body">
                            <h2 className="card-title">Card Title</h2>
                            <p>
                              A card component has a figure, a body part, and
                              inside body there are title and actions parts
                            </p>
                            <div className="card-actions justify-end">
                              <button className="btn btn-primary">
                                Buy Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
              {content.map((item, index) => (
                <div key={index} className="h-80 bg-white rounded-lg shadow-md">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
