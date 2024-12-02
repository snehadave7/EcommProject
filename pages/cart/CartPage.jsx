import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteCartItem,
  fetchCartItem,
  updateCartItemQuantity,
} from "../../store/cartItemsSlice";
import { toast } from "react-toastify";
import { BadgeIndianRupee } from "lucide-react";

const initialState = {
  carts: [
    {
      id: "",
      productId: "",
      quantity: "",
    },
  ],
};

const CartPage = () => {
  const userId = localStorage.getItem("user");
  const cartId = parseInt(localStorage.getItem("cartId"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.shopCart);

  useEffect(() => {
    if (cartId) {
      dispatch(fetchCartItem(cartId));
    }
     console.log("test", cartItems);
  }, [dispatch]);

  if (!cartItems) {
    return <p>Loading...</p>; // Or any loading indicator
  }

  const handleQuantityChange = (
    event,
    change,
    quantity,
    product,
    cartItemId
  ) => {
    event.preventDefault();
    const newQuantity = quantity + change;
    // console.log("Current Quantity:", quantity, "Change:", change);
    // console.log("New Quantity", newQuantity);
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      // console.log(product.id, cartId, quantity);
      dispatch(
        updateCartItemQuantity({
          id: cartItemId,
          cartId: cartId,
          productId: product.id,
          quantity: newQuantity,
        })
      ).then((data) => {
        if (data.payload) {
          toast.success("Cart updated!");
          dispatch(fetchCartItem(cartId)); // Refresh cart items
          // setQuantity(newQuantity); // Update local state
        } else {
          toast.error("Failed to update cart");
        }
      });
    }
  };
  const handleRemoveItem = (e, id) => {
    e.preventDefault();
    dispatch(deleteCartItem(id)).then((data) => {
      if (data) {
        dispatch(fetchCartItem(cartId));
        toast.success("Item deleted successfully");
      }
    });
  };

  const handleCheckout = () => {
    // Checkout logic (e.g., redirect to checkout page)
    alert("Proceeding to checkout");
    navigate("/payment");
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

 

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>
      {!cartItems && cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group">
            {cartItems
              .filter((item) => item.product != null)
              .map((item) => (
                <li
                  key={item.product.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h5>{item.product.name}</h5>
                    <p>{item.product.description}</p>
                    <p>₹{item.product.price}</p>
                  </div>
                  <div className="d-flex">
                    <button
                      className="btn btn-secondary"
                      onClick={(e) =>
                        handleQuantityChange(
                          e,
                          -1,
                          item.quantity,
                          item.product,
                          item.id
                        )
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="mx-3">{item.quantity}</span>
                    <button
                      className="btn btn-secondary"
                      onClick={(e) =>
                        handleQuantityChange(
                          e,
                          1,
                          item.quantity,
                          item.product,
                          item.id
                        )
                      }
                      disabled={item.quantity >= item.product.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={(e) => handleRemoveItem(e, item.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
          </ul>
          <div className="mt-4">
            <div
              className="alert alert-warning text-center mt-4"
              style={{ fontSize: "1.5rem", fontWeight: "bold" }}
            >
              Total Amount: ₹{calculateTotal()}
            </div>
            <button
              className="btn btn-primary btn-lg px-4 py-2 shadow rounded-pill"
              onClick={handleCheckout}
              style={{
                backgroundColor: "#007bff",
                border: "none",
                fontWeight: "bold",
                fontSize: "1.2rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
                transition: "transform 0.2s ease-in-out",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <i className="bi bi-cart-check me-2"></i>
              Proceed to Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
