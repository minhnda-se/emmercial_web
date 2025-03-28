import React from "react";
import "./Header.scss"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
const Header = () => {
  return (
    <div className="header">
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl brand-name" href="/">Taka</a>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto"
        />
          <div className="w-10 rounded-full bg-accent-content icon-rounded">
              <a href="/login"><FontAwesomeIcon icon={faUser} size="xl" fixedWidth color="white" className="user-icon"/></a>
          </div>
          

      </div>
    </div>
  </div>
  );
};

export default Header;
