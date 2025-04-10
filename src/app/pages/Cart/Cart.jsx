import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../components/CardContext"; // Import the useCart hook
import "./Cart.scss";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeItem } = useCart(); // Access cartItems and removeItem from context

  const [prices, setPrices] = useState({});
  const [quantities, setQuantities] = useState({});
  const [total, setTotal] = useState(0);
  const [checkedItems, setCheckedItems] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null); // Store the item to delete

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
      [itemId]: Math.min(prev[itemId] + 1, 100), // Max quantity of 100
    }));
  };

  const handleDown = (itemId) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(prev[itemId] - 1, 1), // Min quantity of 1
    }));
  };

  const handleRemove = (itemId) => {
    // Store the item to be deleted and show the modal
    setItemToDelete(itemId);
    document.getElementById("my_modal_1").showModal();
  };

  const confirmRemoveItem = () => {
    removeItem(itemToDelete); // Remove the item from the cart
    document.getElementById("my_modal_1").close(); // Close the dialog
    setItemToDelete(null); // Clear the item to delete
    toast.success("Đã được xóa thành công!");
  };

  const cancelRemoveItem = () => {
    document.getElementById("my_modal_1").close(); // Close the dialog without removing the item
    setItemToDelete(null); // Clear the item to delete
  };

  const handleCheckout = () => {
    if (checkedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm!");
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
    <>
      <ToastContainer style={{ top: "1%" }} />
      <div className="cart-wrapper flex justify-around ">
        <div className="userCart-content ">
          <ul className="list bg-white rounded-lg shadow-md userCart-item overflow-hidden !p-4 ">
            {/* Check All checkbox */}
            <div className="flex items-center justify-between !pb-3 border-b border-gray-200">
              <div className="flex flex-col">
                <h1 className="cart-title text-2xl font-bold">Giỏ Hàng</h1>
                <div className="text-xs opacity-75 font-semibold">
                  {cartItems.length} sản phẩm
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold">Chọn tất cả</label>
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={handleCheckAll}
                  className="checkbox checkbox-secondary !p-1 text-white"
                />
              </div>
            </div>

            {cartItems.map((item) => (
              <li key={item.id} className="list-row userCart-list">
                <div className="item-details flex justify-start items-center gap-5">
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(item.id)}
                    onChange={() => handleCheck(item.id)}
                    className="checkbox checkbox-secondary !p-1 text-white"
                  />
                  <img
                    className="size-20"
                    src={item.thumbnail || item.image}
                    alt={item.name}
                  />
                  <div className="item-name">
                    <div>{item.name}</div>

                    {item.variant && (
                      <div className="text-xs italic text-gray-400">
                        {item.variant}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs font-semibold opacity-90 text-secondary min-w-1/5 text-right !pr-10 ">
                  {formatNumber(item.price)}đ
                </div>
                <div className="quantity-selector border-1 border-solid border-secondary rounded-sm">
                  <div className="border-r-1 border-solid border-secondary rounded-l-sm">
                    <button
                      className="quantity-button"
                      onClick={() => handleDown(item.id)}
                    >
                      -
                    </button>
                  </div>
                  <input
                    className="item-quantity"
                    value={quantities[item.id]} // Controlled input
                    type="number"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      // Update quantities state, ensuring the value is a valid number
                      if (
                        newValue >= 1 &&
                        newValue <= 100 &&
                        !isNaN(newValue)
                      ) {
                        setQuantities((prev) => ({
                          ...prev,
                          [item.id]: newValue,
                        }));
                      }
                    }}
                  />
                  <div className="border-l-1 border-solid border-secondary rounded-r-sm">
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
                    onClick={() => handleRemove(item.id)} // Trigger remove confirmation
                  >
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      size="lg"
                      fixedWidth
                      className="!p-2 rounded-full"
                    />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Confirmation Dialog */}
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box !py-5 !px-4">
            <h3 className="font-bold text-lg">Bạn có chắc muốn xóa không?</h3>
            <div className="modal-action !mt-6">
              <button
                className="btn !p-3 min-w-[70px]"
                onClick={cancelRemoveItem}
              >
                Không
              </button>
              <button
                className="btn btn-primary !p-3 min-w-[70px]"
                onClick={confirmRemoveItem}
              >
                Có
              </button>
            </div>
          </div>
        </dialog>

        <div className="userCart-container">
          <div className="order-details !sticky top-4 w-[30vw] !p-4 bg-white rounded-lg shadow-md">
            <div className="!pb-3">
              <h1 className="font-bold text-lg">Đơn hàng</h1>
              {checkedItems.length > 0 && (
                <div className="text-xs opacity-75 font-semibold">
                  {checkedItems.length} sản phẩm
                </div>
              )}
            </div>

            <div className="order-content mt-4 border-t border-gray-200 !pt-4">
              <div className="order-info">
                <div className="order-info-row flex justify-between border-b border-gray-200 !pb-3 !mb-3">
                  <div className="order-item-info w-4/5">
                    <div className="text-sm text-secondary font-bold w-1/10">
                      SL
                    </div>
                    <div className="text-sm text-center font-bold w-9/10">
                      Sản phẩm đã chọn
                    </div>
                  </div>
                  <div className="flex flex-col w-1/5 items-end text-secondary font-bold">
                    Thành tiền
                  </div>
                </div>
                {cartItems
                  .filter((item) => checkedItems.includes(item.id))
                  .map((item) => (
                    <div
                      key={item.id}
                      className="order-info-row flex mt-2 border-b border-gray-200 !pb-3 !mb-3"
                    >
                      <div className="order-item-info w-4/5 gap-1">
                        <div className="text-sm text-secondary font-semibold opacity-90 w-1/10">
                          {quantities[item.id]}x
                        </div>
                        <div className="flex flex-col text-wrap w-8/10">
                          <div className="text-sm items-start">{item.name}</div>
                          {item.variant && (
                            <div className="text-xs italic text-gray-400">
                              {item.variant}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col w-1/5 items-end text-secondary">
                        <div>
                          {formatNumber(quantities[item.id] * prices[item.id])}đ
                        </div>
                        <div className="text-xs font-semibold opacity-60">
                          {formatNumber(item.price)}đ
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="order-section order-total mt-4">
                <div className="text-s font-bold">Tổng tiền thanh toán</div>
                <div className="font-bold text-secondary">
                  {formatNumber(total)}đ
                </div>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="btn w-full btn-secondary text-white !mt-2"
            >
              Chuyển sang thanh toán
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
