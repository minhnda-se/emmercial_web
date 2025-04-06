import React, { useState, useRef, useEffect, memo } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./DetailPng.scss";
import Loading from "../Loading";

// Using memo to prevent unnecessary re-renders
const ImageGallery = memo(({ data, spid }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [highlightItems, setHighlightItems] = useState([]);
  const [highlightTitle, setHighlightTitle] = useState("");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const thumbnailsRef = useRef(null);
  const thumbWidth = 80;
  const visibleThumbs = 6;
  const containerWidth = thumbWidth * visibleThumbs;

  // Process product images
  useEffect(() => {
    const processProductImages = () => {
      try {
        console.log("New Data", data);

        // Extract highlights if available
        if (data?.highlight) {
          if (data.highlight.items && Array.isArray(data.highlight.items)) {
            setHighlightItems(data.highlight.items);
          }
          if (data.highlight.title) {
            setHighlightTitle(data.highlight.title);
          }
        } else {
          setHighlightItems([]);
          setHighlightTitle("");
        }

        // Process images from .images property or directly from data array
        let productImages = [];

        // If data is an array (direct images array like in your JSON sample)
        if (Array.isArray(data)) {
          productImages = data.map((image) => ({
            large_url: image.large_url || image.base_url,
            medium_url: image.medium_url || image.base_url,
            small_url: image.small_url || image.thumbnail_url || image.base_url,
          }));
        }
        // If data has an images property
        else if (data?.images) {
          productImages = data.images.map((image) => ({
            large_url: image.large_url || image.base_url,
            medium_url: image.medium_url || image.base_url,
            small_url: image.small_url || image.thumbnail_url || image.base_url,
          }));
        }

        setImages(productImages);

        // Set the first image as selected if available
        if (productImages.length > 0) {
          setSelectedImage(productImages[0].large_url);
          setSelectedIndex(0); // Reset selected index to first image
          // Show/hide arrows based on image count
          setShowRightArrow(productImages.length > visibleThumbs);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    // Only process if there's data
    if (data) {
      setLoading(true); // Reset loading state when processing new data
      processProductImages();
    }
  }, [data]); // Remove spid dependency since we're not using it for configurable products

  // Handle selecting an image
  const handleSelectImage = (url, index) => {
    setSelectedImage(url);
    setSelectedIndex(index);
    ensureVisible(index);
  };

  // Add scroll event listener to update arrow visibility
  useEffect(() => {
    const handleScroll = () => {
      if (!thumbnailsRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = thumbnailsRef.current;

      // Show left arrow if not at the start
      setShowLeftArrow(scrollLeft > 0);

      // Show right arrow if not at the end
      const isAtEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth;
      setShowRightArrow(!isAtEnd);
    };

    const thumbnailsElement = thumbnailsRef.current;
    if (thumbnailsElement) {
      thumbnailsElement.addEventListener("scroll", handleScroll);
      // Initial check
      handleScroll();
    }

    return () => {
      if (thumbnailsElement) {
        thumbnailsElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [images]);

  // Ensure the selected thumbnail is visible in the viewport
  const ensureVisible = (index) => {
    if (!thumbnailsRef.current) return;

    // Calculate the position of the selected thumbnail
    const selectedPosition = index * thumbWidth;
    const containerScrollLeft = thumbnailsRef.current.scrollLeft;
    const containerWidth = thumbnailsRef.current.clientWidth;

    // If the thumbnail is outside the view on the left
    if (selectedPosition < containerScrollLeft) {
      thumbnailsRef.current.scrollTo({
        left: selectedPosition,
        behavior: "smooth",
      });
    }
    // If the thumbnail is outside the view on the right
    else if (
      selectedPosition + thumbWidth >
      containerScrollLeft + containerWidth
    ) {
      thumbnailsRef.current.scrollTo({
        left: selectedPosition - containerWidth + thumbWidth,
        behavior: "smooth",
      });
    }
  };

  // Handle previous button click
  const handlePrev = () => {
    if (!thumbnailsRef.current) return;

    thumbnailsRef.current.scrollBy({
      left: -thumbWidth,
      behavior: "smooth",
    });
  };

  // Handle next button click
  const handleNext = () => {
    if (!thumbnailsRef.current) return;

    thumbnailsRef.current.scrollBy({
      left: thumbWidth,
      behavior: "smooth",
    });
  };

  // If loading, show a loading indicator
  if (loading) {
    return <Loading />;
  }

  // If error, show error message
  if (error) {
    return <div className="image-gallery__error">Error: {error}</div>;
  }

  // If no images found
  if (images.length === 0) {
    return (
      <div className="image-gallery__empty">
        No images available for this product
      </div>
    );
  }

  return (
    <div className="image-gallery">
      {/* Main selected image */}
      <div className="image-gallery__main">
        <img
          src={selectedImage}
          alt="Selected Product"
          className="image-gallery__main-image"
        />
      </div>

      {/* Container for thumbnail carousel */}
      <div
        className="image-gallery__carousel"
        style={{ maxWidth: containerWidth }}
      >
        {/* Previous button - only show if we can scroll left */}
        {images.length > visibleThumbs && showLeftArrow && (
          <button
            className="image-gallery__nav-button image-gallery__nav-button--prev"
            onClick={handlePrev}
          >
            <LeftOutlined />
          </button>
        )}

        {/* Scrollable thumbnails container */}
        <div className="image-gallery__thumbnails-container">
          <div ref={thumbnailsRef} className="image-gallery__thumbnails">
            {images.map((image, index) => (
              <div
                key={index}
                onClick={() => handleSelectImage(image.large_url, index)}
                className={`image-gallery__thumbnail ${
                  selectedIndex === index
                    ? "image-gallery__thumbnail--active"
                    : ""
                }`}
              >
                <img
                  src={image.small_url}
                  alt={`Product Thumbnail ${index + 1}`}
                  className="image-gallery__thumbnail-image"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Next button - only show if we can scroll right */}
        {images.length > visibleThumbs && showRightArrow && (
          <button
            className="image-gallery__nav-button image-gallery__nav-button--next"
            onClick={handleNext}
          >
            <RightOutlined />
          </button>
        )}
      </div>

      {/* Product Highlights Section */}
      {highlightItems.length > 0 && (
        <div className="product-highlights">
          <h3 className="product-highlights__title">{highlightTitle}</h3>
          <ul className="product-highlights__list">
            {highlightItems.map((item, index) => (
              <li key={index} className="product-highlights__item">
                <span className="product-highlights__check-icon">✓</span>
                <span className="product-highlights__text">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

export default ImageGallery;
