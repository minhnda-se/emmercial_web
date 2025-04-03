import React from "react";
import "./Header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <div className="header">
      <div className="navbar bg-white l shadow-sm !mb-6 h-25">
        <div className="flex-1">
          <div className="avatar">
            <div className="w-24 rounded-xl favicon">
              <Link to="/">
                <img src={logo} />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex gap-2 search-bar">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
          <div className="w-10 rounded-full bg-accent-content icon-rounded">
            <a href="/login">
              <FontAwesomeIcon
                icon={faUser}
                size="xl"
                fixedWidth
                color="white"
                className="user-icon"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
