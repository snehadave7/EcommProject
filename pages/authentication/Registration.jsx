import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registration.css";
import { registerUser } from "../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    contactNumber: "",
    password: "",
    email: "",
    role: "customer", // Default role
  });

  const [errors, setErrors] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (!formData.userName) newErrors.userName = "Username is required.";

    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required.";
    } else if (formData.contactNumber.length < 9) {
      newErrors.contactNumber = "Contact number must be 10 digits.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (
      !/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must be at least 8 characters, include one uppercase letter, and one special character.";
    }
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Email is not valid.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData({ ...formData, [name]: value });

    // Validate dynamically for the current field
    const newErrors = validate();
    setErrors({ ...errors, [name]: newErrors[name] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log("Registration Data: ", formData);

      dispatch(registerUser(formData)).then((result) => {
        console.log(result.payload);
        if (result.payload.status === "Success") {
          console.log("if condition run");
          setFormData({
            firstName: "",
            lastName: "",
            userName: "",
            contactNumber: "",
            password: "",
            email: "",
            role: "customer",
          });
          navigate("/login");
        } else {
          if (result.payload.message === "User already exists!") {
            toast.error("This user already exists. Please try logging in.");
          } else if (result.payload.message === "Username already exists!") {
            toast.error("Username already exists!");
          } else if (result.payload.message === "Email already exists!") {
            toast.error("Email already exists!");
          }
        }
      });
    }
  };

  return (
    <div className="registration-container">
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        {errors.firstName && <span className="error">{errors.firstName}</span>}

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        {errors.lastName && <span className="error">{errors.lastName}</span>}

        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={formData.userName}
          onChange={handleChange}
        />
        {errors.userName && <span className="error">{errors.userName}</span>}

        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleChange}
        />
        {errors.contactNumber && (
          <span className="error">{errors.contactNumber}</span>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Register</button>
      </form>
      <div className="login-option">
        <p>Already have an account?</p>
        <button onClick={() => navigate("/login")} className="login-button">
          Login
        </button>
      </div>
    </div>
  );
};

export default Registration;
