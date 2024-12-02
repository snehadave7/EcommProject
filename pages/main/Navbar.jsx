import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import CartPage from "../cart/CartPage";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/userSlice";
import logo from "../../assests/quitqlogo.png"
 import "./Navbar.css"; 
import SearchProducts from "./search";

const Navbar = ({ cartSize }) => {
  const { user, userInfo } = useSelector((state) => state.user);
    const storedUser = JSON.parse(localStorage.getItem("user"));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const LogoutComponent = () => {};
  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(logout());
    navigate("/login");
  };
  const SearchProducts=()=>{
    navigate("/search");
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary py-2">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src={logo}
            alt="Site Logo"
            className="d-inline-block align-text-top"
          />
        </Link>

        {/* Navbar Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left Section */}
          <ul className="navbar-nav me-auto">
            {!user&& !storedUser ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/clothing">
                    Fashion
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/electronics">
                    Electronics
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/groceries">
                    Grocery
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Right Section */}
          <ul className="navbar-nav ms-auto align-items-center">
            {storedUser&& (
              <>
                <li className="nav-item me-3">
                  <form className="d-flex">
                    
                    <button onClick={SearchProducts} className="btn btn-light" type="submit">
                      Search
                    </button>
                  </form>
                </li>
                <li className="nav-item me-3">
                  <Link className="nav-link" to="/account">
                    Account
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">
                    <button className="btn btn-primary">
                      <FontAwesomeIcon
                        icon={faShoppingCart}
                        style={{ fontSize: "20px" }}
                        className="me-1"
                      />
                      ({cartSize})
                    </button>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
