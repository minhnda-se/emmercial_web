import React, { useState, useEffect } from "react";
import "./Header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faHouse, faSearch } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/favicon.png";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../components/CardContext"; // Import useCart

const Header = () => {
  const [commitment, setCommitment] = useState({});
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { cartItems } = useCart(); // Access cart items from context
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const loggedIn = sessionStorage.getItem("token");
    if (loggedIn) {
      setIsLoggedIn(true);
    }

    // Fetch commitment data
    const fetchCommitment = async () => {
      const DOMAIN = import.meta.env.VITE_API_URL;
      try {
        const response = await fetch(
          `${DOMAIN}/raiden/v3/widgets/reasons_to_believe?platform=desktop&page_name=Home`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCommitment(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCommitment();
  }, []);

  // Calculate the number of items in the cart
  const cartIndex = cartItems.length;

  const handleSearchClick = () => {
    if (searchValue.trim() !== "") {
      const query = encodeURIComponent(searchValue);
      navigate(`/search?q=${query}`);
    }
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="header !mb-6 bg-white shadow-sm overflow-hidden">
      <div className="bg-emerald-100">
        <div className="header-commitment flex justify-around !p-2">
          {commitment.data?.map((item, index) => (
            <div className="flex items-center gap-2" key={index}>
              <img
                src={item.icon}
                alt=""
                style={{ width: item.icon_width, height: item.icon_height }}
              />
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="navbar flex w-[93vw] !m-auto items-center justify-between !py-3">
        <div className="avatar">
          <div className="w-24 rounded-xl">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </div>
        </div>

        <div className="flex items-center w-[60%] gap-2">
          <label className="input w-[90%] !px-5 !mr-2 bg-transparent">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              value={searchValue}
              onInput={handleSearchChange}
              placeholder="Search"
              aria-label="Search input"
            />
          </label>
          <button
            className="btn btn-secondary w-[10%]"
            onClick={handleSearchClick}
            aria-label="Search button"
          >
            <FontAwesomeIcon
              icon={faSearch}
              size="xl"
              fixedWidth
              color="white"
              className="!p-2 rounded-full"
            />
          </button>
        </div>

        <div className="flex gap-4 font-bold">
          <Link
            to="/"
            className="btn btn-ghost flex items-center text-secondary hover:!no-underline !pr-3 font-bold text-[20px]"
          >
            <FontAwesomeIcon
              icon={faHouse}
              size="l"
              fixedWidth
              color="primary"
              className="!p-2 rounded-full"
            />
            <p>Trang chủ</p>
          </Link>
          {isLoggedIn ? ( // Conditional rendering based on login status
            <Link
              to={"/profile"}
              className="btn btn-ghost flex items-center hover:!no-underline !pr-3 font-bold text-[20px]"
            >
              <FontAwesomeIcon
                icon={faUser}
                size="l"
                fixedWidth
                color="black"
                className="!p-2 rounded-full"
              />
              <p>Profile</p>
            </Link>
          ) : (
            <Link
              to={"/login"}
              className="btn btn-ghost flex items-center hover:!no-underline !pr-3 font-bold text-[20px]"
            >
              <FontAwesomeIcon
                icon={faUser}
                size="l"
                fixedWidth
                color="black"
                className="!p-2 rounded-full"
              />
              <p>Tài khoản</p>
            </Link>
          )}

          <Link to={"/cart"} className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="badge text-white rounded-full badge-xs indicator-item !px-1.25 text-accent-content text-[10px] bg-red-500">
                {cartIndex}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
