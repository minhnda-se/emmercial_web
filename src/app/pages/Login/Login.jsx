import React, { useEffect, useState } from "react";
import "./Login.scss";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For sign up
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

  // If the user is logged in, redirect to the home page
  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast.error("No user found, please sign up first!");
      return;
    }

    const { email: storedEmail, password: storedPassword } = user;

    if (email === storedEmail && password === storedPassword) {
      sessionStorage.setItem("token", "token1-auth");
      window.location.reload();
    } else {
      toast.error("Invalid email or password!");
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all the fields!");
      return;
    }

    const user = { email: email, password: password, name: name };
    localStorage.setItem("user", JSON.stringify(user));
    setIsSignUp(false);

    toast.success("Account created successfully!");
  };

  return (
    <>
      <ToastContainer />
      <div className="login-container !py-10">
        <div className={`container ${isSignUp ? "right-panel-active" : ""}`}>
          {/* Sign-up Form */}
          <div className="form-container sign-up-container">
            <form onSubmit={handleSignUp}>
              <h1>Create Account</h1>
              <div className="social-container">
                <a href="#" className="social">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="#" className="social">
                  <FontAwesomeIcon icon={faGoogle} />
                </a>
              </div>
              <span>or use your email for registration</span>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name" // This is suggested to identify the name field
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email" // Added autocomplete for email
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password" // Suggested for new password fields
              />
              <button type="submit">Sign Up</button>
            </form>
          </div>

          {/* Sign-in Form */}
          <div className="form-container sign-in-container">
            <form onSubmit={handleSignIn}>
              <h1>Sign in</h1>
              <div className="social-container">
                <a href="#" className="social">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="#" className="social">
                  <FontAwesomeIcon icon={faGoogle} />
                </a>
              </div>
              <span>or use your account</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email" // Added autocomplete for email
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password" // Added autocomplete for current password
              />
              <a href="#">Forgot your password?</a>
              <button type="submit">Sign In</button>
            </form>
          </div>

          {/* Overlay with buttons */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Hello, friend!!</h1>
                <p>
                  To keep connected with us please login with your personal
                  info.
                </p>
                <button className="ghost" onClick={handleSignInClick}>
                  Sign In
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Welcome Back!</h1>
                <p>Enjoy your shopping experiences with us.</p>
                <button className="ghost" onClick={handleSignUpClick}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
