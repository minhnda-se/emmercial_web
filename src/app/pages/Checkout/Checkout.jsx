import React from "react";
import "./Checkout.scss";
export default function Checkout() {
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
  console.log(formatNumber(totalPrice));
  let shippingFee = 10000;
  return (
    <div className="checkout-wrapper">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      <div className="checkout-container">
        <div className="left-container">
          <div className="cart-container">
            {booked.map((item) => (
              <ul
                key={item.id}
                className="list bg-white shadow-md border-b-1 border-solid border-neutral first:rounded-t-sm last:rounded-b-sm cart-item"
              >
                <li className="list-row ">
                  <div>
                    <img className="size-10 rounded-box" src={item.image} />
                  </div>
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs uppercase font-semibold opacity-60">
                      SL: x{item.quantity}
                    </div>
                  </div>
                  <div className="text-warning font-semibold">
                    {formatNumber(item.price)}đ
                  </div>
                </li>
              </ul>
            ))}
          </div>
          <div className="payment-container bg-white shadow-md rounded-sm">
            <h3 className="font-bold">Chọn hình thức thanh toán</h3>
            <div className="radio-container">
              <div className="radio-item">
                <input type="radio" name="radio-1" defaultChecked />
                <div className="avatar">
                  <div className="w-8 rounded-full">
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
                  <div className="w-8 rounded-full">
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
                  <div className="w-8 rounded-full">
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
                  <div className="w-8 rounded-full">
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
                  <div className="w-8 rounded-full">
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
                  <div className="w-8 rounded-full">
                    <img
                      src="https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png"
                      alt=""
                    />
                  </div>
                </div>
                <h3 className="text-sm">Thanh toán tiền mặt</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="right-container">
          <div className="bill-container bg-white shadow-md rounded-sm ">
            <div className="bill-header bill-content">
              <h3 className="font-bold text-lg">Đơn hàng</h3>
              <p className="text-xs font-semibold opacity-60">
                {booked.length} sản phẩm.
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
                    <div className="text-sm">{item.name}</div>
                  </div>
                  <div className="text-warning">{formatNumber(item.price)}đ</div>
                </div>
              ))}
            </div>
            <p className="border-b-1 border-solid border-neutral"></p>
            <div className="bill-price bill-content">
              <div className="bill-price-row">
                <div className="bill-price-item">
                  <div className="text-sm opacity-70 font-semibold">Tổng tiền hàng</div>
                  <div className="text-warning">{formatNumber(totalPrice)}đ</div>
                </div>
                <div className="bill-price-item">
                  <div className="text-sm opacity-70 font-semibold">Phí vận chuyển</div>
                  <div className="text-warning">{formatNumber(shippingFee)}đ</div>
                </div>
              </div>
            </div>
            <p className="border-b-1 border-solid border-neutral"></p>
            <div className="bill-total bill-content">
              <div className="bill-total-row">
                <div className="font-bold">Tổng tiền thanh toán</div>
                <div className="text-warning font-bold">{formatNumber(totalPrice + shippingFee)}đ</div>
              </div>
            </div>
            <div className="bill-button btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">
            <button className="btn btn-error w-full">Thanh toán</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
