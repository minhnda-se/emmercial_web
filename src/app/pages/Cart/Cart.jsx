import React, { useState, useEffect } from "react";
import "./Cart.scss";
import { useNavigate } from "react-router-dom";
export default function Cart() {
  const [booked, setBooked] = useState([
    {
      id: 1,
      image: "https://example.com/image1.jpg",
      name: "Book 1",
      price: 100000,
      quantity: 1,
    },
    {
      id: 2,
      image: "https://example.com/image2.jpg",
      name: "Book 2",
      price: 15000,
      quantity: 1,
    },
    {
      id: 3,
      image: "https://example.com/image3.jpg",
      name: "Book 3",
      price: 20000,
      quantity: 1,
    },
  ]);
  
  const [prices, setPrices] = useState(() =>
    Object.fromEntries(booked.map((item) => [item.id, item.price]))
  );
  
  const [quantities, setQuantities] = useState(() =>
    Object.fromEntries(booked.map((item) => [item.id, item.quantity]))
  );
  
  const [total, setTotal] = useState(0);
  const [checkedItems, setCheckedItems] = useState([]);

  const navigate = useNavigate();
  
  
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
      .reduce((total, item) => {
        return total + prices[item.id] * quantities[item.id];
      }, 0);
  
    setTotal(totalPrice);
  }, [checkedItems, prices, quantities]);
  
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
    // Remove item by filtering it out of the "booked" list
    setBooked((prev) => prev.filter((item) => item.id !== itemId));
  };
  const handleCheckout = () => {
    if (checkedItems.length === 0) {
      alert("Vui lòng chọn sản phẩm để thanh toán!");
      return;
    }
    const selectedItems = booked.filter((item) => checkedItems.includes(item.id));
    navigate("/checkout", { state: { selectedItems } });
  };
  
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  console.log(checkedItems)
  let discount = 0;
  return (
    <div className="cart-wrapper">
      <h1 className="cart-title text-lg font-bold">Giỏ Hàng</h1>
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
                    <img className="size-10 rounded-box" src={item.image} />
                  </div>
                  <div className="item-name">
                    <div>{item.name}</div>
                    <div className="text-xs font-semibold opacity-60">
                      {formatNumber(item.price)}đ
                    </div>
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
                  onClick={() => handleRemove(item.id)} // Handle Remove
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="order-details bg-white shadow-md rounded-sm">
          <div className="font-bold">
            <h1>Đơn hàng</h1>
          </div>
          <div className="order-content">
            <div className="order-section">
              <div className="text-xs opacity-75">Tổng tiền hàng</div>
              <div>{formatNumber(total)}đ</div>
            </div>
            <div className="order-section">
              <div className="text-xs opacity-75">Giảm giá trực tiếp</div>
              <div>{formatNumber(discount)}đ</div>
            </div>
            <div className="order-section order-total">
              <div className="text-xs font-bold">Tổng tiền thanh toán</div>
              <div>{formatNumber(total - discount)}đ</div>
            </div>
          </div>
            <button onClick={handleCheckout} className="btn w-full btn-info text-white">
            Chuyển sang thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
