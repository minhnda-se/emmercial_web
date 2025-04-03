import React, { useEffect, useState } from "react";
import { fetchRecommendProduct } from "../services/fetchRecommendProduct";
import { RatingStar } from "./RatingStar";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductSkeleton from "./ProductSkeleton";

export const RecommendProduct = () => {
  const [product, setProduct] = useState({}); // State for the current product tab
  const [fetchData, setFetchData] = useState({}); // State for the fetched data
  const [productIndex, setProductIndex] = useState(0); // Index to track the selected tab
  const [productsList, setProductsList] = useState([]); // State to store product list
  const [page, setPage] = useState(1); // Track current page for pagination
  const [loading, setLoading] = useState(false); // State for loading
  const [isViewMore, setIsViewMore] = useState(false);

  useEffect(() => {
    const recommendProductData = async () => {
      try {
        const data = await fetchRecommendProduct(); // Fetch initial data
        if (data?.tabs?.length) {
          setFetchData(data);
          setProduct(data.tabs[0]); // Set the first tab's products
          setProductsList(data.tabs[0]?.items); // Set the initial product list
        }
      } catch (error) {
        console.error("Error fetching banner:", error);
      }
    };
    recommendProductData();
  }, []);

  useEffect(() => {
    if (isViewMore) {
      fetchMoreProducts();
    }
  }, [isViewMore]);

  const handleClick = (index) => {
    const section = document.getElementById("recommend");
    window.scrollTo({
      top: section.offsetTop - 50, // Scroll to the top of the section
      behavior: "smooth", // Smooth scrolling
    });

    setProductIndex(index);
    if (fetchData.tabs) {
      setProduct(fetchData.tabs[index]);
      setProductsList(fetchData.tabs[index]?.items); // Reset products when tab is clicked
    }
    setIsViewMore(false);
  };

  const fetchMoreProducts = async () => {
    if (!isViewMore) {
      return;
    }
    setLoading(true);
    try {
      const newData = await fetchRecommendProduct(page + 1); // Fetch next page of products
      if (newData?.tabs?.length) {
        const newProducts = newData.tabs[productIndex]?.items || [];
        setProductsList((prevProducts) => [...prevProducts, ...newProducts]); // Append new products
        setPage(page + 1); // Increment the page number for the next fetch
      }
    } catch (error) {
      console.error("Error fetching more products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div id="recommend"></div>
      <div className="bg-white rounded-lg shadow-md !sticky top-0 z-20 !mt-[-10px]">
        <h3 className="font-bold text-lg !px-3 !py-3">{fetchData.title}</h3>
        <div className="rounded-lg shadow-md flex justify-around items-center">
          {fetchData?.tabs?.map((item, index) => (
            <button
              key={index}
              className={`w-1/6 home-card flex flex-col items-center !py-2 ${
                index === productIndex && "bg-neutral-content"
              }`}
              onClick={() => handleClick(index)}
              aria-selected={index === productIndex ? "true" : "false"}
            >
              <div className="avatar">
                <div className="w-12 rounded-lg">
                  <img src={item.icon} />
                </div>
              </div>
              <p className="text-[12px] text-center text-wrap !mt-2 font-bold">
                {item.title}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <InfiniteScroll
        dataLength={productsList.length} // Current length of the list
        next={fetchMoreProducts} // Function to call when more items are required
        hasMore={true} // You can condition this based on whether there are more items to load
        scrollThreshold={0.95} // Trigger fetch when 90% of the list is scrolled
        endMessage={<p className="text-center">No more products to load.</p>} // End message when no more products
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 rounded-lg">
          {productsList.length ? (
            productsList.map((item, index) => (
              <div
                key={item.id + index}
                id={`product-${item.id}`}
                className="card shadow-sm border-1 border-zinc-100 home-card"
              >
                <figure className="relative">
                  <img
                    src={item?.thumbnail_url}
                    alt="Shoes"
                    className="w-full"
                    style={{
                      width: `${item?.thumbnail_width}px`,
                    }}
                  />
                  {item?.badges_v3?.[0]?.image && (
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
                        item?.discount_rate !== 0
                          ? "text-secondary"
                          : "text-black"
                      } font-bold text-[16px]`}
                    >
                      {item?.price?.toLocaleString()}
                      <span className="align-super underline text-[14px]">
                        đ
                      </span>
                    </h3>
                    {item?.discount_rate !== 0 ? (
                      <div className="flex gap-1 items-start">
                        <div className="badge badge-neutral w-10 h-5 text-[10px] text-white flex justify-center items-center">
                          -{item?.discount_rate}%
                        </div>
                        <h3 className="text-[11px] line-through text-gray-500">
                          {item?.original_price?.toLocaleString()}
                          <span className="align-super text-[8px]">đ</span>
                        </h3>
                      </div>
                    ) : (
                      <div className="h-5"></div>
                    )}
                    {item?.origin && (
                      <p className="text-[10px] !mt-1 truncate-multiline h-2">
                        Made in {item?.origin}
                      </p>
                    )}
                  </div>
                  <hr className="border-base-200 border-1" />
                  {item?.badges_new?.[0]?.icon && (
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
            ))
          ) : (
            <p>No products available</p>
          )}
          {loading && <ProductSkeleton />}
        </div>
      </InfiniteScroll>
      <div className="self-center">
        <button
          className="btn btn-outline btn-primary !px-8 h-10 w-50"
          style={{ display: isViewMore ? "none" : "block" }}
          onClick={() => setIsViewMore(true)}
        >
          Xem thêm
        </button>
      </div>
    </>
  );
};
