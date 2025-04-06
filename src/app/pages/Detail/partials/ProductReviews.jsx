import React, { useState, useEffect } from "react";
import {
  StarFilled,
  StarOutlined,
  LikeOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Initialize dayjs plugins
dayjs.extend(relativeTime);

const ProductReviews = ({ productId, spid, sellerId = 1 }) => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    perPage: 5,
    currentPage: 1,
    lastPage: 1,
  });
  const [ratingStats, setRatingStats] = useState({});

  // Function to fetch reviews
  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);

      // Construct API URL with parameters - removed filter params
      const apiUrl = `https://tiki.vn/api/v2/reviews?limit=5&include=comments,contribute_info,attribute_vote_summary&page=${page}&spid=${spid}&product_id=${productId}&seller_id=${sellerId}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();

      // Update state with fetched data
      setReviews(data.data);
      setPagination(data.paging);
      setRatingStats({
        average: data.rating_average,
        count: data.reviews_count,
        stars: data.stars,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchReviews();
  }, [productId, spid]);

  // Handle page change
  const handlePageChange = (page) => {
    fetchReviews(page);
  };

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">
          {i <= rating ? <StarFilled /> : <StarOutlined />}
        </span>
      );
    }
    return stars;
  };

  // Format date for display
  const formatDate = (timestamp) => {
    return dayjs.unix(timestamp).fromNow();
  };

  // Generate pagination buttons - FIXED to limit visible pages
  const renderPaginationButtons = () => {
    const buttons = [];
    const currentPage = pagination.current_page;
    const lastPage = pagination.last_page;

    // Number of page buttons to show (excluding prev/next buttons)
    const maxVisiblePages = 5;

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-8 h-8 flex items-center justify-center rounded ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        &lt;
      </button>
    );

    // Logic for showing page numbers with ellipses
    if (lastPage <= maxVisiblePages) {
      // If total pages are less than maxVisiblePages, show all pages
      for (let i = 1; i <= lastPage; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              currentPage === i
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      // Calculate start and end of visible pages
      let startPage, endPage;

      if (currentPage <= Math.floor(maxVisiblePages / 2) + 1) {
        // Current page is close to the beginning
        startPage = 1;
        endPage = maxVisiblePages - 1;

        // Add first pages
        for (let i = startPage; i <= endPage; i++) {
          buttons.push(
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                currentPage === i
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {i}
            </button>
          );
        }

        // Add ellipsis and last page
        buttons.push(
          <span
            key="ellipsis1"
            className="w-8 h-8 flex items-center justify-center"
          >
            ...
          </span>
        );
        buttons.push(
          <button
            key={lastPage}
            onClick={() => handlePageChange(lastPage)}
            className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-100"
          >
            {lastPage}
          </button>
        );
      } else if (currentPage >= lastPage - Math.floor(maxVisiblePages / 2)) {
        // Current page is close to the end
        startPage = lastPage - (maxVisiblePages - 2);
        endPage = lastPage;

        // Add first page and ellipsis
        buttons.push(
          <button
            key={1}
            onClick={() => handlePageChange(1)}
            className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-100"
          >
            1
          </button>
        );
        buttons.push(
          <span
            key="ellipsis2"
            className="w-8 h-8 flex items-center justify-center"
          >
            ...
          </span>
        );

        // Add last pages
        for (let i = startPage; i <= endPage; i++) {
          buttons.push(
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                currentPage === i
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {i}
            </button>
          );
        }
      } else {
        // Current page is in the middle
        startPage = currentPage - Math.floor((maxVisiblePages - 3) / 2);
        endPage = currentPage + Math.floor((maxVisiblePages - 3) / 2);

        // Add first page and ellipsis
        buttons.push(
          <button
            key={1}
            onClick={() => handlePageChange(1)}
            className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-100"
          >
            1
          </button>
        );
        buttons.push(
          <span
            key="ellipsis3"
            className="w-8 h-8 flex items-center justify-center"
          >
            ...
          </span>
        );

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
          buttons.push(
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                currentPage === i
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {i}
            </button>
          );
        }

        // Add ellipsis and last page
        buttons.push(
          <span
            key="ellipsis4"
            className="w-8 h-8 flex items-center justify-center"
          >
            ...
          </span>
        );
        buttons.push(
          <button
            key={lastPage}
            onClick={() => handlePageChange(lastPage)}
            className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-100"
          >
            {lastPage}
          </button>
        );
      }
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className={`w-8 h-8 flex items-center justify-center rounded ${
          currentPage === lastPage
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        &gt;
      </button>
    );

    return buttons;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Khách hàng đánh giá
      </h2>

      {/* Rating summary - Completely restructured to fix overlap issues */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Average rating display */}
        <div className="flex items-center">
          <div className="text-3xl font-bold text-blue-600 mr-3">
            {ratingStats.average?.toFixed(1) || "0.0"}
          </div>
          <div>
            <div className="flex mb-1">
              {renderStars(Math.round(ratingStats.average || 0))}
            </div>
            <div className="text-gray-600 text-sm">
              ({ratingStats.count || 0} đánh giá)
            </div>
          </div>
        </div>

        {/* Star distribution - Fixed height for each rating row */}
        <div className="flex-1">
          {ratingStats.stars &&
            Object.keys(ratingStats.stars)
              .sort((a, b) => b - a)
              .map((stars) => (
                <div key={stars} className="flex items-center h-8">
                  <div className="w-12 flex justify-end mr-2">
                    {renderStars(parseInt(stars, 10)).slice(0, 1)}
                    <span className="text-yellow-400 ml-1">{stars}</span>
                  </div>
                  <div className="w-full max-w-xs mx-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-yellow-400 rounded-full"
                        style={{
                          width: `${ratingStats.stars[stars].percent}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm w-12">
                    {ratingStats.stars[stars].count}
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Show loading state */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Reviews list */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="pb-4 border-b border-gray-100">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-medium">
                        {review.created_by?.name?.charAt(0).toUpperCase() ||
                          "U"}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <h4 className="font-medium text-gray-800">
                          {review.created_by?.name || "Người dùng ẩn danh"}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {review.timeline ? review.timeline.explain : ""}
                        </span>
                      </div>

                      <div className="flex items-center mt-1 mb-2">
                        <div className="flex text-yellow-400 mr-2">
                          {renderStars(review.rating)}
                        </div>
                        <div className="text-blue-600 font-medium">
                          {review.title}
                        </div>
                      </div>

                      <div className="text-gray-700 mb-2">{review.content}</div>

                      {/* Display review images if any */}
                      {review.images?.length > 0 && (
                        <div className="flex flex-wrap gap-2 my-2">
                          {review.images.map((image) => (
                            <div
                              key={image.id}
                              className="w-16 h-16 overflow-hidden rounded"
                            >
                              <img
                                src={image.full_path}
                                alt="Review"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center mt-3 text-sm">
                        <button className="flex items-center mr-4 text-gray-500 hover:text-blue-600">
                          <LikeOutlined className="mr-1" />
                          <span>Hữu ích ({review.thank_count || 0})</span>
                        </button>
                        <button className="flex items-center text-gray-500 hover:text-blue-600">
                          <MessageOutlined className="mr-1" />
                          <span>{review.comments?.length || 0}</span>
                        </button>
                      </div>

                      {/* Comments - Increased spacing between comments */}
                      {review.comments?.length > 0 && (
                        <div className="mt-4 ml-3 border-l-2 border-gray-100 pl-3">
                          {review.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="mt-4 bg-gray-50 p-3 rounded"
                            >
                              <div className="flex items-center mb-1">
                                <img
                                  src={
                                    comment.avatar_url ||
                                    "//tiki.vn/assets/img/avatar.png"
                                  }
                                  alt={comment.fullname}
                                  className="w-5 h-5 rounded-full mr-2"
                                />
                                <span className="font-medium text-xs">
                                  {comment.fullname}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">
                                {comment.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                Không có đánh giá nào
              </div>
            )}
          </div>

          {/* FIXED Pagination to limit visible pages */}
          {pagination.total > pagination.per_page && (
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-1">
                {renderPaginationButtons()}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductReviews;
