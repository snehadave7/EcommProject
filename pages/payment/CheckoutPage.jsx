import React, { useEffect, useState } from "react";
import img from "../../assests/accImg.png";
import AddAddressForm from "../userProfile/AddAddressForm";
import AddressCard from "../userProfile/AddressCard";
import { useDispatch, useSelector } from "react-redux";
import CartPage from "../cart/CartPage";
import { fetchCartItem } from "../../store/cartItemsSlice";
import { toast } from "react-toastify";
import { addNewOrder } from "../../store/orderSlice";
import { addNewPayment } from "../../store/paymentSlice";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    paymentMethod: "credit-card",
  });
  const userId=parseInt(localStorage.getItem("userId"));
  const [addressId, setAddressId] = useState(null);
  const { cartItems } = useSelector((state) => state.shopCart);
  // const { products } = useSelector((state) => state.shopProducts);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  console.log(currentSelectedAddress);
  const cartId = parseInt(localStorage.getItem("cartId"));
  const navigate=useNavigate();
  useEffect(() => {
    if (cartId) {
      dispatch(fetchCartItem(cartId));
    }
  }, [dispatch, cartId]);

  const totalCartAmount = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // console.log(cartItems);
  const handleCheckout = async () => {
    if (!currentSelectedAddress) {
      toast.error("Please select an address for delivery.");
      return;
    }
    // console.log(cartItems);
    const currentTS= new Date()
    for(const item of cartItems) {
      let orderData = {
        userId: userId,
        productId: item.product.id,
        orderDate:currentTS,
        quantity: item.quantity,
        orderStatus: "placed",
        addressId: currentSelectedAddress.id, // Using selected address for the order
      };
      dispatch(addNewOrder(orderData)).then(data=>{
        console.log("Called this",data);
         const payment={
            orderId:parseInt(data.payload),
            status: formData.paymentMethod==="credit-card" || formData.paymentMethod==="paypal"? "Completed":"Pending",
            method: formData.paymentMethod,
            paymentDate:currentTS
         }
        dispatch(addNewPayment({payment})).then(data=>{
          console.log(data);
         })
         toast.success("Order Placed");
         navigate("/account/orders")
      })
  
    };

  };
  

  return (
    <div className="d-flex flex-column">
      <div
        className="position-relative"
        style={{ height: "300px", width: "100%", overflow: "hidden" }}
      >
        <img src={img} className="h-100 w-100 object-cover object-center" />
      </div>
      <div className="row mt-5 p-3">
        <div className="col-12 col-sm-6">
          <AddAddressForm
            setCurrentSelectedAddress={setCurrentSelectedAddress}
          />
        </div>

        <div className="col-12 col-sm-6 d-flex flex-column gap-3">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div
                className="card mb-3"
                key={index}
                style={{ maxWidth: "540px" }}
              >
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="img-fluid rounded-start"
                      style={{ height: "100px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{item.product.name}</h5>
                      <p className="card-text">
                        Price: ₹{item.product.price * item.quantity} <br />
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p> Empty</p>
          )}
          <div className="mt-4">
            <div className="d-flex justify-content-between">
              <span className="font-weight-bold">Total</span>
              <span className="font-weight-bold">$ {totalCartAmount()}</span>
            </div>
          </div>
          <div className="form-group mb-3">
            <label style={{ margin: 6 }}>Payment Method</label>
            <select
              className="form-control"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
            >
              <option value="credit-card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
          <button
            onClick={handleCheckout}
            type="submit"
            className="btn btn-success w-100"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
