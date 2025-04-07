import React, { useEffect, useRef, useState } from "react";
import "./Header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faHouse, faSearch } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/favicon.png";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [commitment, setCommitment] = useState({});
  const [error, setError] = useState(null); // Error state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const searchValue = useRef(); // Reference to the search input
  const [cartIndex, setCartIndex] = useState(0);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cartItems"));
    if (cart && Array.isArray(cart)) {
      setCartIndex(cart.length);
    }
    const fetchCommitment = async () => {
      const DOMAIN = import.meta.env.VITE_API_URL;
      try {
        const response = await fetch(
          `${DOMAIN}/raiden/v3/widgets/reasons_to_believe?platform=desktop&page_name=Home`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse response into JSON
        setCommitment(data); // Set the fetched data into state
      } catch (error) {
        setError(error.message); // Set the error message
      }
    };

    // Check if the user is logged in by looking for a token or a flag in sessionStorage
    const loggedIn = sessionStorage.getItem("token");
    if (loggedIn) {
      setIsLoggedIn(true); // Update the state if the token is found
    }

    fetchCommitment();
  }, []); // Empty dependency array, so this runs only once on mount

  // Handle Search Click
  const handleSearchClick = () => {
    const searchQuery = searchValue.current.value;
    if (searchQuery.trim() !== "") {
      // Redirect to a search results page with the query as a URL parameter
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="header !mb-6 bg-white shadow-sm overflow-hidden">
      {console.log(cartIndex)}
      <div className=" bg-emerald-100 ">
        <div className="header-commitment flex justify-around !p-2 ">
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
          <label className="input w-[90%] !px-5 bg-transparent">
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
              ref={searchValue}
              type="search"
              required
              placeholder="Search"
            />
          </label>
          <button
            className="btn btn-secondary w-[10%]"
            onClick={handleSearchClick}
          >
            <FontAwesomeIcon
              icon={faSearch}
              size="xl"
              fixedWidth
              color="white"
              className="!p-2 rounded-full "
            />
          </button>
        </div>

        <div className="flex gap-4 font-bold">
          <Link to="/" className="flex items-center text-secondary ">
            <FontAwesomeIcon
              icon={faHouse}
              size="l"
              fixedWidth
              color="primary"
              className="!p-2 rounded-full "
            />
            <p>Trang chủ</p>
          </Link>
          {isLoggedIn ? ( // Conditional rendering based on login status
            <Link to={"/profile"} className="flex items-center">
              <FontAwesomeIcon
                icon={faUser}
                size="l"
                fixedWidth
                color="black"
                className="!p-2 rounded-full "
              />
              <p>Profile</p>
            </Link>
          ) : (
            <Link to={"/login"} className="flex items-center">
              <FontAwesomeIcon
                icon={faUser}
                size="l"
                fixedWidth
                color="black"
                className="!p-2 rounded-full "
              />
              <p>Tài khoản</p>
            </Link>
          )}
          <Link
            to={"/cart"}
            tabIndex={cartIndex}
            role="button"
            className="btn btn-ghost btn-circle"
          >
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />{" "}
              </svg>
              <span className="badge badge-accent badge-xs indicator-item !px-1 text-accent-content text-[10px]">
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
