import React, { useState } from "react";
import "./Login.scss";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const location = useLocation();

  // Nếu từ trang nào đó redirect sang login thì lưu lại
  const from = location.state?.from || "/";

  const token = sessionStorage.getItem("token");

  // Nếu đã đăng nhập thì quay lại trang chủ
  if (token) {
    return <Navigate to={from} replace />;
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
      toast.error(
        "Không tìm thấy tài khoản đăng nhập. Hãy chắc rằng bạn đã đăng ký!"
      );
      return;
    }

    const { email: storedEmail, password: storedPassword } = user;

    if (email === storedEmail && password === storedPassword) {
      sessionStorage.setItem("token", "token1-auth");
      toast.success("Đăng nhập thành công!");
      window.location.reload();
    } else {
      toast.error("Mật khẩu hoặc tài khoản không đúng");
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Trường không được trống!");
      return;
    }

    const user = { email: email, password: password, name: name };
    localStorage.setItem("user", JSON.stringify(user));
    setIsSignUp(false);

    toast.success("Đăng ký thành công!");
  };

  return (
    <>
      <ToastContainer />
      <div className="login-container !py-10">
        <div className={`container ${isSignUp ? "right-panel-active" : ""}`}>
          {/* Sign-up Form */}
          <div className="form-container sign-up-container">
            <form onSubmit={handleSignUp}>
              <h1>Đăng ký</h1>
              <div className="social-container">
                <a href="#" className="social">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="#" className="social">
                  <FontAwesomeIcon icon={faGoogle} />
                </a>
              </div>
              <span>hoặc sử dụng email để đăng ký</span>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button type="submit">Đăng ký</button>
            </form>
          </div>

          {/* Sign-in Form */}
          <div className="form-container sign-in-container">
            <form onSubmit={handleSignIn}>
              <h1>Đăng nhập</h1>
              <div className="social-container">
                <a href="#" className="social">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="#" className="social">
                  <FontAwesomeIcon icon={faGoogle} />
                </a>
              </div>
              <span>hoặc sử dụng tài khoản hiện có</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <a href="#">Quên mật khẩu?</a>
              <button type="submit">Đăng nhập</button>
            </form>
          </div>

          {/* Overlay with buttons */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Xin chào!!</h1>
                <p>Hãy đăng nhập để trải nghiệm những giây phút tuyệt vời.</p>
                <button className="ghost" onClick={handleSignInClick}>
                  Đăng nhập
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Chào mừng trở lại!</h1>
                <p>Tận hưởng phút giây mua hàng với chúng tôi.</p>
                <button className="ghost" onClick={handleSignUpClick}>
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
