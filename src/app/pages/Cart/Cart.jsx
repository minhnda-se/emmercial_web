import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../components/CardContext"; // Import the useCart hook
import "./Cart.scss";
import {
  faDeleteLeft,
  faTrash,
  faTrashAlt,
  faTrashCan,
  faTrashCanArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeItem } = useCart(); // Access cartItems and removeItem from context

  const [prices, setPrices] = useState({});
  const [quantities, setQuantities] = useState({});
  const [total, setTotal] = useState(0);
  const [checkedItems, setCheckedItems] = useState([]);

  // Load cart items and prices from localStorage
  useEffect(() => {
    const priceMap = {};
    const quantityMap = {};

    cartItems.forEach((item) => {
      priceMap[item.id] = item.price;
      quantityMap[item.id] = item.quantity;
    });

    setPrices(priceMap);
    setQuantities(quantityMap);

    // Set all items to checked by default
    const initialCheckedItems = cartItems.map((item) => item.id);
    setCheckedItems(initialCheckedItems);
  }, [cartItems]);

  useEffect(() => {
    const totalPrice = cartItems
      .filter((item) => checkedItems.includes(item.id))
      .reduce((sum, item) => {
        return sum + prices[item.id] * quantities[item.id];
      }, 0);

    setTotal(totalPrice);
  }, [checkedItems, prices, quantities, cartItems]);

  const handleCheck = (itemId) => {
    setCheckedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

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
    // Remove the item from cart using removeItem from context
    removeItem(itemId);
  };

  const handleCheckout = () => {
    if (checkedItems.length === 0) {
      alert("Vui lòng chọn sản phẩm để thanh toán!");
      return;
    }

    const selectedItems = cartItems
      .filter((item) => checkedItems.includes(item.id))
      .map((item) => ({
        ...item,
        quantity: quantities[item.id],
        totalPrice: quantities[item.id] * prices[item.id],
      }));

    localStorage.setItem("checkoutItem", JSON.stringify(selectedItems));
    navigate("/checkout");
  };

  const formatNumber = (num) =>
    num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Add handleCheckAll function to select all items
  const handleCheckAll = (event) => {
    if (event.target.checked) {
      setCheckedItems(cartItems.map((item) => item.id));
    } else {
      setCheckedItems([]);
    }
  };

  const isAllChecked =
    cartItems.length > 0 && checkedItems.length === cartItems.length;

  return (
    <div className="cart-wrapper">
      <h1 className="cart-title text-2xl font-bold">Giỏ Hàng</h1>

      <div className="userCart-container">
        <div className="userCart-content">
          <ul className="list bg-white rounded-sm shadow-md userCart-item">
            {/* Check All checkbox */}
            <div className="flex items-center justify-between !p-2">
              <div className="text-xs opacity-75 font-semibold">
                {cartItems.length} sản phẩm.
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold">Chọn tất cả</label>
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={handleCheckAll}
                  className="checkbox checkbox-success !p-1"
                />
              </div>
            </div>
            <hr />
            {cartItems.map((item) => (
              <li key={item.id} className="list-row userCart-list">
                <div className="item-details flex justify-start items-center gap-5">
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(item.id)}
                    onChange={() => handleCheck(item.id)}
                    className="checkbox  !p-1"
                  />
                  <img
                    className="size-20"
                    src={item.thumbnail || item.image}
                    alt={item.name}
                  />
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
                <div className="flex items-center">
                  <button
                    className="btn button-remove bg-transparent border-none shadow-none"
                    onClick={() => handleRemove(item.id)}
                  >
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      size="lg"
                      fixedWidth
                      className="!p-2 rounded-full "
                    />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="order-details sticky top-5 w-[30vw] max-h-[calc(100vh-100px)] p-6 bg-white rounded-lg shadow-md">
          <h1 className="font-bold text-lg">Đơn hàng</h1>
          {checkedItems.length > 0 && (
            <div className="text-xs opacity-75 font-semibold">
              {checkedItems.length} sản phẩm.
            </div>
          )}
          <div className="order-content mt-4">
            <div className="order-info">
              {cartItems
                .filter((item) => checkedItems.includes(item.id))
                .map((item) => (
                  <div
                    key={item.id}
                    className="order-info-row flex justify-between mt-2"
                  >
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

            <div className="order-section order-total mt-4">
              <div className="text-xs font-bold">Tổng tiền thanh toán</div>
              <div>{formatNumber(total)}đ</div>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="btn w-full btn-info text-white mt-4"
          >
            Chuyển sang thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
