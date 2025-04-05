import React, { useState, useEffect } from "react";
import "./Cart.scss";

export default function Cart() {
  const booked = [
    {
      id: 1,
      image: "https://example.com/image1.jpg",
      name: "Book 1",
      price: 100000,
      quantity: 2,
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
      quantity: 3,
    },
  ];

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const totalPrice = booked.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
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
                    <input type="checkbox"  name="check" id="check" />
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
                <div className="quantity-selector">
                  <select
                    defaultValue="Pick a Runtime"
                    className=" w-[40px] h-[60%] border-solid border-success border-2"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={9}>9</option>
                    <option value={10}>10</option>
                  </select>
                </div>
                <button className="btn button-remove bg-white border-none">
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="order-details bg-white shadow-md rounded-sm">
          <div className="font-bold"><h1>Đơn hàng</h1></div>
          <div className="order-content">
            <div className="order-section">
              <div className="text-xs opacity-75">Tổng tiền hàng</div>
              <div>{formatNumber(totalPrice)}đ</div>
            </div>
            <div className="order-section">
              <div className="text-xs opacity-75">Giảm giá trực tiếp</div>
              <div>{discount}đ</div>
            </div>
            <div className="order-section order-total">
              <div className="text-xs font-bold">Tổng tiền thanh toán</div>
              <div>{formatNumber(totalPrice-discount)}đ</div>
            </div>
          </div>
          <button className="btn w-full btn-info text-white">Chuyển sang thanh toán</button>
        </div>
      </div>
    </div>
  );
}
