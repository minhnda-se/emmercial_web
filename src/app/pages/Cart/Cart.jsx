import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.scss";

export default function Cart() {
  const navigate = useNavigate();

  const [booked, setBooked] = useState([]);
  const [prices, setPrices] = useState({});
  const [quantities, setQuantities] = useState({});
  const [total, setTotal] = useState(0);
  const [checkedItems, setCheckedItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setBooked(storedItems);

    const priceMap = {};
    const quantityMap = {};
    storedItems.forEach((item) => {
      priceMap[item.id] = item.price;
      quantityMap[item.id] = item.quantity;
    });

    setPrices(priceMap);
    setQuantities(quantityMap);

    // Set all items to checked by default when the page first loads
    const initialCheckedItems = storedItems.map((item) => item.id);
    setCheckedItems(initialCheckedItems);
  }, []);

  const handleCheck = (itemId) => {
    setCheckedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  useEffect(() => {
    const totalPrice = booked
      .filter((item) => checkedItems.includes(item.id))
      .reduce((sum, item) => {
        return sum + prices[item.id] * quantities[item.id];
      }, 0);

    setTotal(totalPrice);
  }, [checkedItems, prices, quantities, booked]);

  const handleUp = (itemId) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.min(prev[itemId] + 1, 100),
    }));
  };

  const handleDown = (itemId) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(prev[itemId] - 1, 1),
    }));
  };

  const handleRemove = (itemId) => {
    const updatedBooked = booked.filter((item) => item.id !== itemId);
    setBooked(updatedBooked);

    // Update localStorage
    localStorage.setItem("cartItems", JSON.stringify(updatedBooked));
  };

  const handleCheckout = () => {
    if (checkedItems.length === 0) {
      alert("Vui lòng chọn sản phẩm để thanh toán!");
      return;
    }

    // Create selected items with correct quantity
    const selectedItems = booked
      .filter((item) => checkedItems.includes(item.id))
      .map((item) => ({
        ...item,
        quantity: quantities[item.id],
        totalPrice: quantities[item.id] * prices[item.id],
      }));

    // Save to localStorage

    localStorage.setItem("checkoutItem", JSON.stringify(selectedItems));

    // Navigate to checkout
    navigate("/checkout");
  };

  const formatNumber = (num) =>
    num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <div className="cart-wrapper">
      <h1 className="cart-title text-2xl font-bold">Giỏ Hàng</h1>
      <div className="text-xs opacity-75 font-semibold">
        {booked.length} sản phẩm.
      </div>
      <div className="userCart-container">
        <div className="userCart-content">
          <ul className="list bg-white rounded-sm shadow-md userCart-item">
            {booked.map((item) => (
              <li key={item.id} className="list-row userCart-list">
                <div className="item-details">
                  <div>
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(item.id)}
                      onChange={() => handleCheck(item.id)}
                    />
                  </div>
                  <div className="item-image">
                    <img
                      className="size-10 rounded-box"
                      src={item.thumbnail || item.image}
                      alt={item.name}
                    />
                  </div>
                  <div className="item-name">
                    <div>{item.name}</div>
                    <div className="text-xs font-semibold opacity-60">
                      {formatNumber(item.price)}đ
                    </div>
                    {item.variant && (
                      <div className="text-xs italic text-gray-400">
                        {item.variant}
                      </div>
                    )}
                  </div>
                </div>
                <div className="quantity-selector border-1 border-solid border-success">
                  <div className="border-r-1 border-solid border-success">
                    <button
                      className="quantity-button"
                      onClick={() => handleDown(item.id)}
                    >
                      -
                    </button>
                  </div>
                  <div className="item-quantity">{quantities[item.id]}</div>
                  <div className="border-l-1 border-solid border-success">
                    <button
                      className="quantity-button"
                      onClick={() => handleUp(item.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="btn button-remove bg-white border-none"
                  onClick={() => handleRemove(item.id)}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="order-details bg-white shadow-md rounded-sm">
          <div>
            <h1 className="font-bold">Đơn hàng</h1>
            {checkedItems.length > 0 && (
              <div className="text-xs opacity-75 font-semibold">
                {checkedItems.length} sản phẩm.
              </div>
            )}
          </div>
          <div className="order-content">
            <div className="order-info">
              {booked
                .filter((item) => checkedItems.includes(item.id))
                .map((item) => (
                  <div key={item.id} className="order-info-row">
                    <div className="order-item-info">
                      <div className="text-xs font-semibold opacity-60">
                        {quantities[item.id]}x
                      </div>
                      <div className="text-sm">{item.name}</div>
                    </div>
                    <div>{formatNumber(quantities[item.id] * item.price)}đ</div>
                  </div>
                ))}
            </div>

            <div className="order-section order-total">
              <div className="text-xs font-bold">Tổng tiền thanh toán</div>
              <div>{formatNumber(total)}đ</div>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="btn w-full btn-info text-white"
          >
            Chuyển sang thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
