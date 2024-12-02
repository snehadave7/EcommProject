import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileDetails = () => {
  // State to manage user data, editing state, and form data
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    userName: "",
    contactNumber: "",
    email: "",
    role: "",
    password: "", // Password can be updated or handled separately (depending on your app's logic)
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if(user && user.token){
      axios
        .get(`https://localhost:7152/api/Users/${localStorage.userId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((response) => {
          setUser(response.data);
          setFormData(response.data); // Initialize the form with fetched data
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
    else{
      console.log("No token found");
    }
  }, []);

  const handleChange = (e) => {
    // Handle form input changes
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleSave(e){
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const response = await axios.put(
      `https://localhost:7152/api/Users/${localStorage.userId}`,
      {
        id:parseInt(localStorage.userId),
        firstName:formData.firstName,
        lastName:formData.lastName,
        userName:formData.userName,
        contactNumber:formData.contactNumber,
        email:formData.email,
        password:formData.password,
        role:localStorage.role
      },
      {
        headers: {
          Authorization: `Bearer ${storedUser.token}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      }
    );
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {isEditing ? (
          <form onSubmit={handleSave}>
            <h5 className="mb-4">Edit Profile</h5>

            {/* First Name Field */}
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-control"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            {/* Last Name Field */}
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-control"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            {/* UserName Field */}
            <div className="mb-3">
              <label htmlFor="userName" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                className="form-control"
                value={formData.userName}
                onChange={handleChange}
              />
            </div>

            {/* Contact Number Field */}
            <div className="mb-3">
              <label htmlFor="contactNumber" className="form-label">
                Contact Number
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                className="form-control"
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </div>

            {/* Email Field */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {/* Password Field (Can be handled separately, depending on your logic) */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </form>
        ) : (
          <>
            <h5 className="mb-4">User Details</h5>

            {/* Display user details */}
            <p>
              <strong>First Name:</strong> {user?.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {user?.lastName}
            </p>
            <p>
              <strong>Username:</strong> {user?.userName}
            </p>
            <p>
              <strong>Contact Number:</strong> {user?.contactNumber}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Role:</strong> {user?.role}
            </p>

            {/* Edit button to switch to edit mode */}
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-secondary mt-3"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
