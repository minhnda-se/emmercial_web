import React from "react";
import "./Login.scss";
export default function Login() {
  return (
    <div className="login-background flex items-center justify-center">
      <div className="login-container flex flex-col gap-2 bg-secondary text-secondary-content rounded-lg shadow-md w-1/3 mx-auto mt-10">
        <h1 className="text-center">Login</h1>
        <div className="login-form flex flex-col gap-3">
          <label htmlFor="username">Username</label>
          <input type="text" placeholder="Username" className="input" />
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Password" className="input" />
          <button type="submit" className="btn bg-base-100 w-24 self-center">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
