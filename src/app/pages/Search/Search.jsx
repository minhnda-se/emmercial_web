import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Search.scss";
import { fetchSearchProduct } from "./services/fetchSearchProduct";
import { Product } from "./partials/Product";
import {
  faCancel,
  faFilter,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductSkeleton from "../Home/partials/ProductSkeleton";
import { Pagination } from "antd";

export default function Search() {
  const [product, setProduct] = useState({});
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // States for controlling select values
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // State for services checkboxes
  const [selectedServices, setSelectedServices] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = encodeURIComponent(queryParams.get("q"));

  // Fetch data on initial load and when searchQuery, query or currentPage changes
  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery) return;

      try {
        setIsLoading(true);
        const productData = await fetchSearchProduct(
          searchQuery,
          query,
          currentPage
        );
        setProduct(productData);
        console.log(productData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, query, currentPage]);

  // Handle page change for pagination
  const handlePageChange = (page) => {
    const productSection = document.getElementById("productSection");
    if (productSection) {
      window.scrollTo({
        top: productSection.offsetTop - 50, // Scroll to the top of the section
        behavior: "smooth", // Smooth scrolling
      });
    }
    setCurrentPage(page); // Ant Design Pagination uses a 1-based index
  };

  // Reset all dropdowns
  const resetFilters = () => {
    setSelectedSort("");
    setSelectedRating("");
    setSelectedPrice("");
    setSelectedCategory("");
    setQuery(""); // Reset the query string as well
    setSelectedServices({}); // Reset services checkboxes
    setCurrentPage(1);
  };

  // Update query string based on selected filters
  const updateQueryString = () => {
    console.log(selectedServices);
    let newQuery = "";
    if (selectedSort) newQuery += `&sort=${selectedSort}`;
    if (selectedRating) newQuery += `&rating=${selectedRating}`;
    if (selectedPrice) newQuery += `&price=${selectedPrice}`;
    if (selectedCategory) newQuery += `&category=${selectedCategory}`;

    // Add services to query string
    const selectedServiceKeys = Object.keys(selectedServices).filter(
      (key) => selectedServices[key].checked // Check if the service is checked
    );

    if (selectedServiceKeys.length > 0) {
      // Create a string with the query names of the checked services
      const selectedQueries = selectedServiceKeys
        .map(
          (key) =>
            `${selectedServices[key].query}=${selectedServices[key].value}` // Extract the query name for each checked service
        )
        .join(`&`); // Join the query names into a comma-separated string

      // Append the query names to the newQuery
      newQuery += `&${selectedQueries}`;
    }

    setQuery(newQuery);
  };

  // Update the query whenever one of the select dropdowns or services change
  useEffect(() => {
    updateQueryString();
  }, [
    selectedSort,
    selectedRating,
    selectedPrice,
    selectedCategory,
    selectedServices,
  ]);

  // Update the URL with the new query string whenever the query changes
  useEffect(() => {
    navigate(`?q=${searchQuery}${query}&page=${currentPage}`, {
      replace: true,
    });
  }, [query, searchQuery, navigate, currentPage]);

  // Handle checkbox change
  const handleServiceChange = (serviceId, query, value) => {
    setSelectedServices((prevState) => {
      const updatedServices = { ...prevState };

      // If the checkbox is checked, add it to the state, otherwise remove it
      if (updatedServices[serviceId]?.checked) {
        // Remove service if it's being unchecked
        delete updatedServices[serviceId];
      } else {
        // Add service if it's being checked
        updatedServices[serviceId] = {
          checked: true,
          query: query,
          value: value,
        };
      }

      return updatedServices;
    });
  };

  return (
    <div className="w-[93vw] flex flex-col !m-auto search-container gap-5">
      {searchQuery && product.data ? (
        <>
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <a href="/">Trang chủ</a>
              </li>
              <li>Kết quả tìm kiếm cho "{decodeURIComponent(searchQuery)}"</li>
            </ul>
          </div>
          <div className="w-[100%] flex flex-col gap-4" id="productSection">
            {/* Filters section */}
            <div className="w-[100%]">
              <div className="flex gap-3">
                <fieldset className="fieldset !p-4 bg-base-100 border border-base-300 rounded-box flex gap-5 w-[100%] justify-between bg-white">
                  <legend className="fieldset-legend text-sm text-primary font-bold">
                    Bộ lọc tìm kiếm
                  </legend>
                  <div className="flex gap-5">
                    {/* Sort Dropdown */}
                    <label className="fieldset-label">
                      <select
                        value={selectedSort} // Controlled value
                        onChange={(e) => setSelectedSort(e.target.value)}
                        className="select w-[8vw] !pl-4"
                      >
                        <option value="">Sort by</option>
                        {product.sort?.map((item, index) => (
                          <option key={index} value={item.query_value}>
                            {item.display_value}
                          </option>
                        ))}
                      </select>
                    </label>

                    {/* Rating Dropdown */}
                    <label className="fieldset-label">
                      <select
                        value={selectedRating} // Controlled value
                        onChange={(e) => setSelectedRating(e.target.value)}
                        className="select w-[8vw] !pl-4"
                      >
                        <option value="">Rating</option>
                        {product.filters?.rating.values?.map((item, index) => (
                          <option key={index} value={item.query_value}>
                            {item.display_value}
                          </option>
                        ))}
                      </select>
                    </label>

                    {/* Price Dropdown */}
                    <label className="fieldset-label">
                      <select
                        value={selectedPrice} // Controlled value
                        onChange={(e) => setSelectedPrice(e.target.value)}
                        className="select w-[8vw] !pl-4"
                      >
                        <option value="">Price</option>
                        {product.filters?.price.values?.map((item, index) => (
                          <option key={index} value={item.query_value}>
                            {item.display_value}
                          </option>
                        ))}
                      </select>
                    </label>

                    {/* Category Dropdown */}
                    <label className="fieldset-label">
                      <select
                        value={selectedCategory} // Controlled value
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="select w-[8vw] !pl-4"
                      >
                        <option value="">Category</option>
                        {product.filters?.category.values?.map(
                          (item, index) => (
                            <option key={index} value={item.query_value}>
                              {item.display_value}
                            </option>
                          )
                        )}
                      </select>
                    </label>
                  </div>
                  <div className="flex gap-4">
                    {/* Services Section */}
                    {product.filters?.services.map((item, index) => (
                      <label className="fieldset-label" key={index}>
                        <input
                          type="checkbox"
                          checked={selectedServices[index]?.checked || false}
                          onChange={() =>
                            handleServiceChange(
                              index,
                              item.query_name,
                              item.values[0].query_value
                            )
                          }
                          className="checkbox !p-1"
                        />
                        <img
                          src={item.icon}
                          alt=""
                          style={{
                            width: item.icon_width,
                            height: item.icon_height,
                          }}
                        />
                        <p>{item.display_name}</p>
                      </label>
                    ))}
                  </div>
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      resetFilters();
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faRefresh}
                      size="xl"
                      fixedWidth
                      color="primary"
                      className="!p-2 rounded-full"
                    />
                  </button>
                </fieldset>
              </div>
            </div>

            {/* Product section */}
            {isLoading ? (
              <div className="w-[100%] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 rounded-lg">
                <ProductSkeleton />
              </div>
            ) : (
              <Product productsList={product.data} />
            )}

            {/* Pagination */}
            <div className="w-[100%] justify-center flex">
              <Pagination
                current={currentPage}
                pageSize={product.paging?.per_page} // Adjust based on your product list per page
                total={product.paging?.total} // Total products
                onChange={handlePageChange} // Page change handler
                showSizeChanger={false} // Optionally hide page size changer
                showQuickJumper={true} // Allows jumping to a specific page
                className="flex !mt-5" // Custom class for styling
              />
            </div>
          </div>
        </>
      ) : (
        <p>No search query provided.</p>
      )}
    </div>
  );
}
