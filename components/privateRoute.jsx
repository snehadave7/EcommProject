import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute=({children})=>{

  const{user}=useSelector((state)=>state.user);
  const storedUser=JSON.parse(localStorage.getItem("user"));
  // tempry done to avoid authentiction
  // const isAuthenticated=true;
  if (!user && !storedUser) {
    return <Navigate to="/login" />;
  }
  return <Outlet/>; // Render the child components if authenticated
}
export default PrivateRoute;