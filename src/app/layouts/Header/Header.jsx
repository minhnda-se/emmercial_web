import React, { useState, useEffect, useRef } from "react";
import "./Header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faHouse,
  faMapLocation,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/favicon.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../../components/CardContext"; // Import useCart

const Header = () => {
  const [commitment, setCommitment] = useState({});
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchValue = useRef();
  const searchContainerRef = useRef(null);
  const suggestionsRef = useRef(null);
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

    // Add event listener to close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch search suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim() === "") {
        setSuggestions([]);
        return;
      }

      try {
        const trackityId = "3c2d2eaa-ec0e-527a-3444-2c04e0050144"; // This could be dynamically generated
        const response = await fetch(
          `https://tiki.vn/api/v2/search/suggestion?trackity_id=${trackityId}&q=${encodeURIComponent(
            searchQuery
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch suggestions");
        }
        const data = await response.json();
        setSuggestions(data.data || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        fetchSuggestions();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Calculate the number of items in the cart
  const cartIndex = cartItems.length;

  const handleSearchClick = () => {
    if (searchQuery.trim() !== "") {
      const query = encodeURIComponent(searchQuery);
      navigate(`/search?q=${query}`);
      setShowSuggestions(false);
    }
  };
  const hadleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    return <Navigate to={"/"} replace />;
  };

  const handleSuggestionClick = (suggestion) => {
    // Update the search query state to update the input field
    if (suggestion.type === "keyword") {
      // Fill the search input with the suggestion keyword
      setSearchQuery(suggestion.keyword);

      // Optional: You can add a delay before navigating
      setTimeout(() => {
        if (suggestion.url) {
          // Extract the search query from the URL to ensure consistency
          const urlParams = new URLSearchParams(suggestion.url.split("?")[1]);
          const queryParam = urlParams.get("q");
          if (queryParam) {
            navigate(`/search?q=${queryParam}`);
          } else {
            navigate(`/search?q=${encodeURIComponent(suggestion.keyword)}`);
          }
        } else {
          navigate(`/search?q=${encodeURIComponent(suggestion.keyword)}`);
        }
      }, 200); // Small delay to see the search input populated first
    } else if (suggestion.type === "seller") {
      // For seller type, set search query to store name
      setSearchQuery(suggestion.title || "");

      setTimeout(() => {
        if (suggestion.url) {
          navigate(suggestion.url.replace("https://tiki.vn", ""));
        }
      }, 200);
    }

    // Hide the suggestions after clicking
    setShowSuggestions(false);
  };

  return (
    <div className="header !mb-6 bg-white shadow-sm">
      <div className="bg-emerald-100 overflow-x-hidden">
        <div className="header-commitment flex justify-around !p-2">
          {commitment.data?.map((item, index) => (
            <div className="flex items-center gap-2" key={index}>
              <img
                src={item.icon}
                alt=""
                style={{
                  width: item.icon_width,
                  height: item.icon_height,
                }}
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

        <div className="flex flex-col w-[50%] justify-center gap-2 z-50">
          <div
            className="flex items-center gap-2 relative"
            ref={searchContainerRef}
          >
            <label className="input w-[90%] !px-5 !mr-2 bg-transparent z-0">
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
                ref={searchValue}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim() !== "") {
                    setShowSuggestions(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchClick();
                  }
                }}
                placeholder="Search"
                aria-label="Search input"
                className="z-10"
              />

              {/* Moved search suggestions inside the search container */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  className="search-suggestions-wrapper"
                  ref={suggestionsRef}
                >
                  <div className="search-suggestions">
                    <ul>
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="suggestion-item"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {/* {suggestion.type === "seller" ? (
                          <div className="seller-suggestion">
                            {suggestion.logo && (
                              <img
                                src={suggestion.logo}
                                alt={suggestion.title}
                                className="seller-logo"
                              />
                            )}
                            <div className="seller-info">
                              <div className="seller-title">
                                {suggestion.title}
                              </div>
                              <div className="seller-subtitle">
                                {suggestion.subtitle}
                              </div>
                            </div>
                          </div>
                        ) : ( */}
                          <div className="keyword-suggestion">
                            <FontAwesomeIcon
                              icon={faSearch}
                              size="sm"
                              className="suggestion-icon"
                            />
                            <span>{suggestion.keyword}</span>
                          </div>
                          {/* )} */}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
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

          <div className="w-full">
            <ul className="flex gap-5 text-sm text-gray-400 font-bold">
              <li className="cursor-pointer hover:scale-95 transition-transform duration-200">
                Điện da dụng
              </li>
              <li className="cursor-pointer hover:scale-95 transition-transform duration-200">
                Xe cộ
              </li>
              <li className="cursor-pointer hover:scale-95 transition-transform duration-200">
                Mẹ & bé
              </li>
              <li className="cursor-pointer hover:scale-95 transition-transform duration-200">
                Nhà cửa
              </li>
              <li className="cursor-pointer hover:scale-95 transition-transform duration-200">
                Sách
              </li>
              <li className="cursor-pointer hover:scale-95 transition-transform duration-200">
                Thể thao
              </li>
            </ul>
          </div>
        </div>

        <div className="flex font-bold flex-col w-[25%] gap-2">
          <div className="flex">
            <Link
              to="/"
              className="btn btn-ghost flex items-center text-secondary hover:!no-underline !pr-3 font-bold text-[20px]"
            >
              <FontAwesomeIcon
                icon={faHouse}
                size="l"
                fixedWidth
                color="primary"
                className="p-2 rounded-full"
              />
              <p>Trang chủ</p>
            </Link>

            {isLoggedIn ? (
              <Link
                to={"/login"}
                onClick={() => hadleLogout()}
                className="btn btn-ghost flex items-center hover:!no-underline !pr-3 font-bold text-[20px]"
              >
                <FontAwesomeIcon
                  icon={faUser}
                  size="l"
                  fixedWidth
                  color="black"
                  className="p-2 rounded-full"
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
                  className="p-2 rounded-full"
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

                <span className="badge text-white rounded-full badge-xs indicator-item !px-1.25 text-accent-content text-[10px] bg-red-500 z-0">
                  {cartIndex}
                </span>
              </div>
            </Link>
          </div>
          <div className="flex text-sm">
            <div className="flex font-bold items-center gap-1 cursor-pointer">
              <FontAwesomeIcon
                icon={faMapLocation}
                size="l"
                fixedWidth
                color="gray"
                className="rounded-full"
              />
              <p className="flex">
                <span className="font-bold text-gray-400 !mr-1">Giao đến:</span>
                <span className="hover:underline">
                  Thành phố Thủ Đức, Hồ Chí Minh
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
