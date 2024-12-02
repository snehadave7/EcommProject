import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentPage = ({ cart, totalAmount, setCart }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    paymentMethod: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({
      ...paymentDetails,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate the payment process
    const order = {
      cart,
      totalAmount,
      paymentDetails,
      status: "Placed",
      orderDate: new Date().toISOString(),
    };

    // Make an API call to place the order in the database
    fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Order placed successfully:", data);
        // Clear the cart after placing the order
        setCart([]);
        navigate("/orders"); // Redirect to Orders Page
      })
      .catch((error) => {
        console.error("Error placing the order:", error);
      });
  };

  return (
    <div className="container mt-4">
      <h2>Payment Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Payment Method</label>
          <select
            className="form-select"
            name="paymentMethod"
            value={paymentDetails.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="">Select Payment Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="PayPal">PayPal</option>
          </select>
        </div>

        {paymentDetails.paymentMethod === "Credit Card" ||
        paymentDetails.paymentMethod === "Debit Card" ? (
          <>
            <div className="mb-3">
              <label className="form-label">Card Number</label>
              <input
                type="text"
                className="form-control"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Expiry Date</label>
              <input
                type="month"
                className="form-control"
                name="expiryDate"
                value={paymentDetails.expiryDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">CVV</label>
              <input
                type="text"
                className="form-control"
                name="cvv"
                value={paymentDetails.cvv}
                onChange={handleChange}
                required
              />
            </div>
          </>
        ) : null}

        <div className="mb-3">
          <label className="form-label">Billing Address</label>
          <textarea
            className="form-control"
            name="billingAddress"
            value={paymentDetails.billingAddress}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <h4>Total Amount: ₹{totalAmount}</h4>
        <button type="submit" className="btn btn-success mt-3">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
