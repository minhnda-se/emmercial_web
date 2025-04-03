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
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Banner } from "./partials/Banner";
import { ProductSlide } from "./partials/ProductSlide";
import { fetchFlashSale } from "./services/fetchFlashSale";
import { FlashSale } from "./partials/FlashSale";
import { fetchProminentBrand } from "./services/fetchProminentBrand";
import { fetchOverseaProduct } from "./services/fetchOverseaProduct";
import { fetchEvent } from "./services/fetchEvent";
import { fetchMayLikeProduct } from "./services/fetchMayLikeProduct";
import { RecommendProduct } from "./partials/RecommendProduct";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState({});
  const [banner, setBanner] = useState({});
  const [hotDeals, setHotDeals] = useState({});
  const [topDeals, setTopDeals] = useState({});
  const [flashSale, setFlashSale] = useState({});
  const [prominentBrand, setProminentBrand] = useState({});
  const [overseaProduct, setOverseaProduct] = useState({});
  const [event, setEvent] = useState({});
  const [mayLike, setMayLike] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          categoryData,
          hotDealsData,
          topDealsData,
          bannerData,
          flashSaleData,
          prominentBrandData,
          overseaProductData,
          eventData,
          mayLikeData,
        ] = await Promise.all([
          fetchCategory(),
          fetchHotDeals(),
          fetchTopDeals(),
          fetchBanner(),
          fetchFlashSale(),
          fetchProminentBrand(),
          fetchOverseaProduct(),
          fetchEvent(),
          fetchMayLikeProduct(),
        ]);

        setCategories(categoryData);
        setHotDeals(hotDealsData);
        setTopDeals(topDealsData);
        setBanner(bannerData);
        setFlashSale(flashSaleData);
        setProminentBrand(prominentBrandData);
        setOverseaProduct(overseaProductData);
        setEvent(eventData);
        setMayLike(mayLikeData);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <HomeSkeleton />
      ) : (
        <>
          <div className="flex flex-col justify-between fixed bottom-2 right-2 rounded-lg p-4 w-20 h-30 z-10">
            <div className="flex flex-col justify-between fixed bottom-2 right-2 rounded-lg p-4 w-20 h-30 z-10 !gap-0.5">
              <button
                className="btn flex flex-col btn-secondary text-white h-1/2"
                aria-label="Message"
              >
                <MessageOutlined style={{ fontSize: "24px" }} />
                Message
              </button>

              <button
                className="btn flex flex-col btn-secondary text-white h-1/2"
                aria-label="Support"
              >
                <CustomerServiceOutlined style={{ fontSize: "24px" }} />
                Support
              </button>
            </div>
          </div>

          <div className="home_container flex">
            <div className="home_sidebar rounded-lg !sticky top-0 h-screen overflow-y-auto custom-scrollbar">
              <SideBar categories={categories} />
            </div>
            <div className="home_body flex flex-col gap-6 p-4">
              <div className="h-70 bg-white rounded-lg shadow-md ">
                <Banner banner={banner} />
              </div>
              <div className="min-h-32 bg-white rounded-lg shadow-md flex justify-around items-center !px-2">
                {hotDeals?.items?.length ? (
                  hotDeals.items.map((item, index) => (
                    <button
                      key={index}
                      style={{ width: "8%", height: "70%", padding: "auto" }}
                      className="btn-hotdeals flex flex-col items-center"
                    >
                      <div className="avatar">
                        <div className="w-12 rounded-lg">
                          <img src={item.thumbnail_url} alt={item.name} />
                        </div>
                      </div>
                      <p
                        className="text-[12px] text-center text-wrap !mt-2 font-bold"
                        style={{ color: index === 0 && `${item.name_color}` }}
                      >
                        {item.name}
                      </p>
                    </button>
                  ))
                ) : (
                  <p>No hot deals available.</p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md !px-4 !py-5 flex flex-col justify-around !gap-4">
                {/* Top Deals */}
                <ProductSlide data={topDeals} />
              </div>

              {/* Flash Sales */}
              <FlashSale flashSale={flashSale} />

              {/* Prominent Brands */}
              <div className="bg-gradient-to-b from-neutral-content to-white rounded-lg shadow-md flex flex-col !px-4 !py-4 font-bold text-primary text-lg gap-4">
                <h3>{prominentBrand.data[0]?.title?.text}</h3>
                <div>
                  <Swiper
                    modules={[Navigation]} // Enable navigation and pagination features
                    slidesPerView={5} // Number of slides visible at a time
                    slidesPerGroup={5}
                    navigation
                    spaceBetween={10}
                  >
                    {prominentBrand.data[0]?.banners?.map((item, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="card shadow-sm  border-1 border-zinc-100 home-card"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>

              {/* Oversea products */}
              <div className="bg-white rounded-lg shadow-md !px-4 !py-5 flex flex-col justify-around !gap-4">
                <ProductSlide data={overseaProduct} />
              </div>

              {/* Event */}
              <div className="bg-white rounded-lg shadow-md !px-4 !py-5 flex flex-wrap justify-between !gap-y-3">
                {event?.data?.[0]?.banners?.map((item, index) => (
                  <div className="w-1/6 home-card" key={item.id}>
                    <img
                      src={item.image_url}
                      alt=""
                      style={{
                        width: "95%",
                        margin: "auto",
                      }}
                      className="rounded-lg"
                    />
                  </div>
                ))}
              </div>

              {/* May-Like products */}
              <div className="bg-white rounded-lg shadow-md !px-4 !py-5 flex flex-col justify-around !gap-4">
                <ProductSlide data={mayLike} />
              </div>

              {/* Recommend Products */}
              <RecommendProduct />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
