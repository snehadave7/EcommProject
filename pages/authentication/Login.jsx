import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/userSlice";

const Login = () => {
  // react states
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });


  // redux states
  const { loading, error,user } = useSelector((state) => state.user);
  const role=localStorage.role;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // functions
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(credentials)).then((result) => {
      
      if (result.payload) {
        console.log("login success")
        setCredentials({
          username: "",
          password: "",
        });
      }
    });
  };
  useEffect(()=>{
    if(user) {
      if(role==="customer") navigate("/");
      else if(role==="seller") navigate("/seller");
      else if(role==="admin") navigate("/admin");
    }
  },[user,navigate]);

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
        />
        <button type="submit">{loading ? "Loading..." : "Login"}</button>
        {error && <span className="error">{error.message}</span>}
      </form>
      <div className="register-option">
        <p>Don't have an account?</p>
        <button
          onClick={() => navigate("/register")}
          className="register-button"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
