import React, { useState, useEffect } from "react";
import { PlusOutlined, MinusOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const PaymentComponent = ({ mpid, spid, productData }) => {
  const [quantity, setQuantity] = useState(1);
  const [sellerData, setSellerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch seller information
  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const trackityId = "3c2d2eaa-ec0e-527a-3444-2c04e0050144";
        const apiUrl = `https://api.tiki.vn/product-detail/v2/widgets/seller?seller_id=1&mpid=${mpid}&spid=${spid}&trackity_id=${trackityId}&platform=desktop&version=3`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch seller data");
        }

        const data = await response.json();
        setSellerData(data.data.seller);
      } catch (error) {
        console.error("Error fetching seller info:", error);
      }
    };

    fetchSellerInfo();
  }, [mpid, spid]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [mpid, spid, productData]);

  const handleIncrement = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;
      return newQuantity > 100 ? 100 : newQuantity;
    });
  };

  // Handle decrement quantity
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  // Handle direct input change
  const handleQuantityChange = (e) => {
    const value = e.target.value;

    // Allow empty string for typing purposes
    if (value === "") {
      setQuantity("");
      return;
    }

    // Only accept numbers
    if (!/^\d+$/.test(value)) {
      return;
    }

    const numValue = parseInt(value, 10);

    // Ensure the value is not greater than 100
    if (numValue > 100) {
      setQuantity(100);
    } else if (numValue <= 0) {
      setQuantity(1);
    } else {
      setQuantity(numValue);
    }
  };

  // Handle blur event to fix empty input
  const handleBlur = () => {
    if (quantity === "" || quantity < 1) {
      setQuantity(1);
    }
  };

  // Format price with dots as thousands separators
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!productData?.price || quantity === "") return 0;
    return productData.price * quantity;
  };

  // Get selected product variant details
  const getSelectedVariant = () => {
    if (!productData?.configurable_products || !spid) return null;

    return (
      productData.configurable_products.find((option) => option.id === spid) ||
      null
    );
  };

  // Get selected options display text
  const getOptionsDisplay = () => {
    const selectedVariant = getSelectedVariant();
    if (!selectedVariant) return "";

    const options = [];
    if (selectedVariant.option1) options.push(selectedVariant.option1);
    if (selectedVariant.option2) options.push(selectedVariant.option2);

    return options.join(", ");
  };

  // Hàm lưu thông tin sản phẩm vào localStorage
  const saveProductToLocalStorage = (isBuyNow = false) => {
    const selectedVariant = getSelectedVariant();
    const totalPrice = calculateTotalPrice();

    const productInfo = {
      id: spid || mpid,
      mpid: mpid,
      spid: spid,
      name: productData?.name,
      price: productData?.price,
      thumbnail: selectedVariant?.thumbnail_url || productData?.thumbnail_url,
      quantity: quantity,
      totalPrice: totalPrice,
      variant: getOptionsDisplay(),
      seller: sellerData?.name || "Tiki Trading",
      timestamp: new Date().getTime(),
    };

    // Lấy giỏ hàng hiện tại từ localStorage hoặc tạo mới nếu chưa có
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === productInfo.id
    );

    if (existingItemIndex !== -1) {
      // Nếu đã có, cập nhật số lượng
      cartItems[existingItemIndex].quantity += quantity;
      cartItems[existingItemIndex].totalPrice =
        cartItems[existingItemIndex].price *
        cartItems[existingItemIndex].quantity;
    } else {
      // Nếu chưa có, thêm mới vào giỏ hàng
      cartItems.push(productInfo);
    }

    // Lưu lại vào localStorage

    // Nếu là "Mua ngay", lưu thêm thông tin cho quá trình thanh toán
    if (isBuyNow) {
      const ar = [];
      ar.push(productInfo);
      localStorage.setItem("checkoutItem", JSON.stringify(ar));
      // Chuyển hướng đến trang thanh toán
      navigate("/checkout");
    } else {
      toast.success("Đã thêm vào giõ hàng!");
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      console.log("Added to cart:", productInfo);
      // Bạn có thể thêm code hiển thị thông báo "Đã thêm vào giỏ hàng" ở đây
    }
  };

  // Xử lý sự kiện mua ngay
  const handleBuyNow = () => {
    saveProductToLocalStorage(true);
  };

  // Xử lý sự kiện thêm vào giỏ
  const handleAddToCart = () => {
    saveProductToLocalStorage(false);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg !p-4 shadow-md mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded !mb-4"></div>
          <div className="h-4 bg-gray-200 rounded !mb-4 w-3/4"></div>
          <div className="h-10 bg-gray-200 rounded !mb-4"></div>
          <div className="h-12 bg-gray-200 rounded !mb-4"></div>
        </div>
      </div>
    );
  }

  // Get selected variant
  const selectedVariant = getSelectedVariant();
  const optionsDisplay = getOptionsDisplay();

  return (
    <>
      <ToastContainer />
      <div className="bg-white rounded-lg !p-4 shadow-md max-w-md !mx-auto">
        {/* Header with seller info and search */}
        <div className="flex items-center justify-between !mb-6 !pb-2 border-b border-gray-200">
          <div className="flex items-center">
            {console.log(sellerData?.icon)}
            <img
              src={sellerData?.icon
                .split(
                  "https://vcdn.tikicdn.com/ts/seller/d1/3f/ae/13ce3d83ab6b6c5e77e6377ad61dc4a5.jpg"
                )
                .join("/src/app/assets/favicon.png")}
              alt="MAVT"
              className="h-8 !mr-2"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg">MAVT Trading</span>
              <div className="flex items-center">
                {sellerData?.is_official && (
                  <div className="flex items-center !mr-2">
                    <img
                      src={sellerData?.badge_img?.url}
                      alt="Official"
                      className="h-5"
                    />
                  </div>
                )}
                <span className="font-bold !mr-1 text-yellow-500">
                  {sellerData?.avg_rating_point?.toFixed(1) || "4.7"}
                </span>
                <span className="text-yellow-500">★</span>
                <span className="text-gray-500 text-sm !ml-1">
                  (
                  {sellerData?.review_count
                    ? `${(sellerData.review_count / 1000000).toFixed(
                        1
                      )}tr+ đánh giá`
                    : "5.5tr+ đánh giá"}
                  )
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product variant */}
        {selectedVariant && (
          <div className="flex items-center !py-3 !mb-4">
            <img
              src={selectedVariant?.thumbnail_url || productData?.thumbnail_url}
              alt={productData?.name}
              className="w-12 h-12 object-contain !mr-3 border rounded"
            />
            <span className="font-medium">{optionsDisplay}</span>
          </div>
        )}

        {/* Quantity selector */}
        <div className="!mb-6">
          <label className="block font-medium !mb-2">Số Lượng</label>
          <div className="flex items-center">
            <button
              onClick={handleDecrement}
              className="w-10 h-10 flex items-center justify-center border border-red-300 rounded-l-md cursor-pointer hover:bg-red-100"
              disabled={quantity <= 1}
            >
              <MinusOutlined style={{ color: "red" }} />
            </button>
            <input
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              onBlur={handleBlur}
              className="w-16 h-10 border-t border-b border-red-300 text-center text-red-500 rounded-none focus:outline-none focus:border-red-500"
            />
            <button
              onClick={handleIncrement}
              className="w-10 h-10 flex items-center justify-center border border-red-300 rounded-r-md cursor-pointer hover:bg-red-100"
            >
              <PlusOutlined style={{ color: "red" }} />
            </button>
          </div>
          {quantity === 100 && (
            <p className="text-xs text-red-500 !mt-1">Số lượng tối đa: 100</p>
          )}
        </div>

        {/* Price */}
        <div className="!mb-6">
          <div className="text-gray-800 font-medium !mb-1">Tạm tính</div>
          <div className="text-3xl font-bold">
            {formatPrice(calculateTotalPrice())}đ
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            className="w-full bg-red-400 hover:bg-red-600 text-white !py-3 rounded-md font-medium"
            onClick={handleBuyNow}
          >
            Mua ngay
          </button>
          <button
            className="w-full border border-red-400 text-red-500 hover:bg-red-50 !py-3 rounded-md font-medium"
            onClick={handleAddToCart}
          >
            Thêm vào giỏ
          </button>
          <button
            className="w-full border border-red-400 text-red-500 hover:bg-red-50 !py-3 rounded-md font-medium"
            onClick={handleBuyNow}
          >
            Mua trả góp - trả sau
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentComponent;
