import React from "react";
import AccountNavbar from "./Navbar-UserAccount";
import { Route, Router, Routes } from "react-router-dom";
import ProfileDetails from "./ProfileDetails";
import AddAddressForm from "./AddAddressForm";
import OrderHistory from "./OrderHistory";
function Account() {
  
  return (
    <>
      <AccountNavbar />
      <div>
        <Routes>
          <Route path="profile" element={<ProfileDetails />} />
          <Route path="address" element={<AddAddressForm />} />
          <Route path="orders" element={<OrderHistory />} />
        </Routes>
      </div>

      
    </>
  );
  
}

export default Account;
