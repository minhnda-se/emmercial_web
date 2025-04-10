import React, { useEffect, useState } from "react";
import "./Checkout.scss";
import { ToastContainer, toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../../components/CardContext"; // Import useCart

export default function Checkout() {
  const { deleteCart } = useCart(); // Access cart items from context
  const [booked, setBooked] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const storedCart = localStorage.getItem("checkoutItem");
    if (storedCart) {
      setBooked(JSON.parse(storedCart));
    }
  }, []);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const totalPrice = booked.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  const handlePayClick = () => {
    if (sessionStorage.getItem("token") === null) {
      // Redirect to login if the user is not logged in
      nav("/login", { state: { from: "/checkout" } });
      return;
    }

    // Process the payment success
    toast.success("Thanh toán thành công!");

    // Clear the cart in context and localStorage
    deleteCart(booked);

    // Save the order details to localStorage
    localStorage.setItem("order", JSON.stringify(booked));

    // Remove checkout items and reset the booked items
    localStorage.removeItem("checkoutItem");
    setBooked([]);
  };

  return (
    <>
      <ToastContainer style={{ top: "1%" }} />
      <div className="checkout-wrapper flex justify-around">
        <div className="w-[60vw]">
          <ul className="list bg-white rounded-lg shadow-md overflow-hidden !p-4 ">
            <div className="flex items-center justify-center !pb-3 border-b border-gray-200">
              <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold text-center">Thanh toán</h1>
                <div className="text-xs opacity-75 font-semibold">
                  {booked.length} sản phẩm
                </div>
              </div>
            </div>

            <div className="!p-[10px] flex items-center justify-between border-b border-gray-200">
              <h3 className="font-bold text-lg flex justify-start items-center gap-5 w-[70%]">
                Sản phẩm
              </h3>
              <h3 className="font-bold text-lg opacity-60 w-[10%] text-right">
                Giá
              </h3>
              <h3 className="font-bold text-lg opacity-60 w-[10%] text-center">
                Số lượng
              </h3>
              <h3 className="font-bold text-lg opacity-60 w-[10%] text-right">
                Thành tiền
              </h3>
            </div>
            {booked.map((item) => (
              <li
                key={item.id}
                className="list-row !p-[10px] flex items-center justify-between"
              >
                <div className="w-[70%] flex justify-start items-center gap-5">
                  <img
                    className="size-20"
                    src={item.thumbnail || item.image}
                    alt={item.name}
                  />
                  <div>
                    <div>{item.name}</div>
                    {item.variant && (
                      <div className="text-xs italic text-gray-400">
                        {item.variant}
                      </div>
                    )}
                  </div>
                </div>
                <div className="opacity-90 w-[10%] text-right">
                  {formatNumber(item.price)}đ
                </div>
                <div className="opacity-90 w-[10%] text-center">
                  x{item.quantity}
                </div>
                <div className="text-secondary font-semibold w-[10%] text-right">
                  {formatNumber(item.price * item.quantity)}đ
                </div>
              </li>
            ))}
          </ul>
          {/* </div> */}
          {/* </div>
        </ul> */}
          {/* <div className="checkout-container">
          <div className="right-container">
            <div className="bill-container bg-white shadow-md rounded-sm">
              <div className="bill-header bill-content">
                <h3 className="font-bold text-lg">Đơn hàng</h3>
                <p className="text-xs font-semibold opacity-60">
                  {booked.length} sản phẩm
                </p>
              </div>
              <p className="border-b-1 border-solid border-neutral"></p>
              <div className="bill-item bill-content">
                {booked.map((item) => (
                  <div key={item.id} className="bill-item-row">
                    <div className="bill-item-info">
                      <div className="text-xs font-semibold opacity-60">
                        {item.quantity}x
                      </div>
                      <div className="text-sm flex items-center gap-1">
                        {item.name}
                        {item.variant && (
                          <div className="italic text-gray-400">
                            {`(${item.variant})`}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-warning">
                      {formatNumber(item.price * item.quantity)}đ
                    </div>
                  </div>
                ))}
              </div>
              <p className="border-b-1 border-solid border-neutral"></p>
              <div className="bill-total bill-content">
                <div className="bill-total-row">
                  <div className="font-bold">Tổng tiền thanh toán</div>
                  <div className="text-warning font-bold">
                    {formatNumber(totalPrice)}đ
                  </div>
                </div>
              </div>
              <div className="bill-button btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">
                <button className="btn btn-error w-full">Thanh toán</button>
              </div>
            </div>
          </div>
        </div> */}
        </div>
        <div className="payment-container bg-white shadow-md rounded-lg w-[30vw] h-fit sticky top-4 ">
          <h3 className="font-bold text-2xl border-b border-gray-200 !py-3 text-center">
            Chọn hình thức thanh toán
          </h3>
          <div className="radio-item">
            <input type="radio" name="radio-1" defaultChecked />
            <div className="avatar">
              <div className="w-8">
                <img
                  src="https://salt.tikicdn.com/ts/upload/ce/f6/e8/ea880ef285856f744e3ffb5d282d4b2d.jpg"
                  alt=""
                />
              </div>
            </div>
            <h3 className="text-sm">Momo E-Wallet</h3>
          </div>

          <div className="radio-item">
            <input type="radio" name="radio-1" />
            <div className="avatar">
              <div className="w-8">
                <img
                  src="https://salt.tikicdn.com/ts/upload/5f/f9/75/d7ac8660aae903818dd7da8e4772e145.png"
                  alt=""
                />
              </div>
            </div>
            <h3 className="text-sm">Viettel Money</h3>
          </div>

          <div className="radio-item">
            <input type="radio" name="radio-1" />
            <div className="avatar">
              <div className="w-8">
                <img
                  src="https://salt.tikicdn.com/ts/upload/2f/43/da/dd7ded6d3659036f15f95fe81ac76d93.png"
                  alt=""
                />
              </div>
            </div>
            <h3 className="text-sm">ZaloPay</h3>
          </div>

          <div className="radio-item">
            <input type="radio" name="radio-1" />
            <div className="avatar">
              <div className="w-8">
                <img
                  src="https://salt.tikicdn.com/ts/upload/77/6a/df/a35cb9c62b9215dbc6d334a77cda4327.png"
                  alt=""
                />
              </div>
            </div>
            <h3 className="text-sm">VNPAY</h3>
          </div>

          <div className="radio-item">
            <input type="radio" name="radio-1" />
            <div className="avatar">
              <div className="w-8">
                <img
                  src="https://salt.tikicdn.com/ts/upload/7e/48/50/7fb406156d0827b736cf0fe66c90ed78.png"
                  alt=""
                />
              </div>
            </div>
            <h3 className="text-sm">Thẻ tín dụng/ Ghi nợ</h3>
          </div>

          <div className="radio-item">
            <input type="radio" name="radio-1" />
            <div className="avatar">
              <div className="w-8">
                <img
                  src="https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png"
                  alt=""
                />
              </div>
            </div>
            <h3 className="text-sm">Thanh toán tiền mặt</h3>
          </div>

          <div className="border-t border-gray-200 !mt-4">
            <div className="bill-total bill-content">
              <div className="bill-total-row">
                <div className="font-bold">Tổng tiền thanh toán</div>
                <div className="text-secondary font-bold">
                  {formatNumber(totalPrice)}đ
                </div>
              </div>
            </div>
            <div className="bill-button btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">
              <button
                onClick={() => handlePayClick()}
                className="btn btn-secondary w-full text-white"
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
