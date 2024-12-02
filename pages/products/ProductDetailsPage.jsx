// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import "./ProductDetailsPage.css";
// import { useNavigate } from "react-router-dom";
// import {
//   addToCartItem,
//   fetchCartItem,
//   updateCartItemQuantity,
// } from "../../store/cartItemsSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";

// const ProductDetailsPage = ({setCartSize}) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { state } = useLocation();
//   const product = state?.product || {};
//   const [quantity, setQuantity] = useState(1);
//   const [isInCart, setIsInCart] = useState(false); // Track whether product is in the cart
//   const { cartItems } = useSelector((state) => state.shopCart);
//   // const cartId = useSelector((state) => state.user.cartId);
//   const cartId = parseInt(localStorage.getItem("cartId"));
//   const [cartItemId, setCartItemId] = useState(0);

//   useEffect(() => {
//     dispatch(fetchCartItem(cartId));
//   }, [dispatch, cartId]);

//   useEffect(() => {
//     if (Array.isArray(cartItems) && product.id) {
//       const existingItem = cartItems.find(
//         (item) => item.product.id === product.id
//       );
//       if (existingItem) {
//         setCartItemId(existingItem.id);
//         setQuantity(existingItem.quantity);
//         setIsInCart(true);
//       } else {
//         setIsInCart(false);
//       }
//     }
//   }, [cartItems, product.id]);

//   async function handleAddToCart(productId, quantity) {
//     if (quantity > product.stock) {
//       toast.error("Quantity exceeds available stock");
//       return;
//     }

//     if (!isInCart) {
//       // Create new cart item
//        dispatch(addToCartItem({ cartId, productId, quantity })).then(async(data) => {
//         if (data.payload) {
//           toast.success(`${product.name} added to cart!`);
//           await dispatch(fetchCartItem(cartId)); // Refresh cart items
//           setIsInCart(true); // Mark as in cart
//           setCartItemId(data.payload.id); // Store newly created cart item ID

//         } else {
//           toast.error("Failed to add to cart");
//         }
//       });
//     } else {
//       // Update existing cart item's quantity
//       dispatch(
//         updateCartItemQuantity({
//           id: cartItemId,
//           cartId: cartId,
//           productId: product.id,
//           quantity: quantity,
//         })
//       ).then((data) => {
//         if (data.payload) {
//           toast.success(`${product.name} quantity updated!`);
//           dispatch(fetchCartItem(cartId));
//         } else {
//           toast.error("Failed to update cart");
//         }
//       });
//     }
//   }

//   useEffect(()=>{
//     if(cartItems){
//       setCartSize(cartItems.length);
//     }
//   },[cartItems]);

//   const handleQuantityChange = (event, change) => {
//     event.preventDefault();
//     const newQuantity = quantity + change;
//     console.log("Current Quantity:", quantity, "Change:", change);
//     console.log("New Quantity", newQuantity);
//     if (newQuantity >= 1 && newQuantity <= product.stock) {
//       console.log(product.id, cartId, quantity);
//       dispatch(
//         updateCartItemQuantity({
//           id: cartItemId,
//           cartId: cartId,
//           productId: product.id,
//           quantity: newQuantity,
//         })
//       ).then((data) => {
//         if (data.payload) {
//           toast.success("Cart updated!");
//           dispatch(fetchCartItem(cartId)); // Refresh cart items
//           setQuantity(newQuantity); // Update local state
//         } else {
//           toast.error("Failed to update cart");
//         }
//       });
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <div className="row">
//         <div className="col-md-6">
//           <img
//             src={`https://localhost:7152/${product.imageUrl}`}
//             alt={product.name}
//             className="img-fluid"
//           />
//         </div>
//         <div className="col-md-6">
//           <h2>{product.name}</h2>
//           <p>{product.description}</p>
//           <h4>Price: ₹{product.price}</h4>
//           <p>
//             <strong>Stock:</strong>{" "}
//             {product.stock > 0 ? product.stock : "Out of Stock"}
//           </p>
//           {product.stock > 0 ? (
//             <>
//               {!isInCart ? (
//                 <>
//                   <button
//                     className="btn btn-success mt-3"
//                     onClick={() => handleAddToCart(product.id, quantity)}
//                   >
//                     Add to Cart
//                   </button>
//                 </>
//               ) : (
//                 <div className="d-flex align-items-center mt-3">
//                   <button
//                     className="btn btn-danger"
//                     onClick={(e) => handleQuantityChange(e, -1)}
//                     disabled={quantity <= 1}
//                   >
//                     -
//                   </button>
//                   <span className="mx-3">{quantity}</span>
//                   <button
//                     className="btn btn-primary"
//                     onClick={(e) => handleQuantityChange(e, 1)}
//                     disabled={quantity >= product.stock}
//                   >
//                     +
//                   </button>
//                 </div>
//               )}
//             </>
//           ) : (
//             <button className="btn btn-secondary mt-3" disabled>
//               Out of Stock
//             </button>
//           )}
//           <hr />
//           <h5>Reviews</h5>
//           {product.reviews?.$values?.length > 0 ? (
//             product.reviews.$values.map((review, index) => (
//               <div key={index} className="review">
//                 <p>
//                   <strong>{review.userName || "Anonymous"}</strong>:{" "}
//                   {review.comment}
//                 </p>
//                 <p>Rating: {review.rating}/5</p>
//               </div>
//             ))
//           ) : (
//             <p>No reviews yet.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailsPage;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ProductDetailsPage.css";
import { useNavigate } from "react-router-dom";
import {
  addToCartItem,
  fetchCartItem,
  updateCartItemQuantity,
} from "../../store/cartItemsSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addNewReview,
  deleteReview,
  fetchReview,
} from "../../store/reviewSlice";

const ProductDetailsPage = ({ setCartSize }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const product = state?.product || {};
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false); // Track whether product is in the cart
  const [showReviewForm, setShowReviewForm] = useState(false); // Toggle review form visibility
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const { cartItems } = useSelector((state) => state.shopCart);
  const cartId = parseInt(localStorage.getItem("cartId"));
  const userId = parseInt(localStorage.getItem("userId")); // Assuming userId is stored in localStorage
  const [cartItemId, setCartItemId] = useState(0);
  const { reviewList = [] } = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(fetchReview(product.id));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCartItem(cartId));
  }, [dispatch, cartId]);

  useEffect(() => {
    if (Array.isArray(cartItems) && product.id) {
      const existingItem = cartItems.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        setCartItemId(existingItem.id);
        setQuantity(existingItem.quantity);
        setIsInCart(true);
      } else {
        setIsInCart(false);
      }
    }
  }, [cartItems, product.id]);

  const handleAddToCart = async (productId, quantity) => {
    if (quantity > product.stock) {
      toast.error("Quantity exceeds available stock");
      return;
    }

    if (!isInCart) {
      dispatch(addToCartItem({ cartId, productId, quantity })).then(
        async (data) => {
          if (data.payload) {
            toast.success(`${product.name} added to cart!`);
            await dispatch(fetchCartItem(cartId)); // Refresh cart items
            setIsInCart(true); // Mark as in cart
            setCartItemId(data.payload.id); // Store newly created cart item ID
          } else {
            toast.error("Failed to add to cart");
          }
        }
      );
    } else {
      dispatch(
        updateCartItemQuantity({
          id: cartItemId,
          cartId: cartId,
          productId: product.id,
          quantity: quantity,
        })
      ).then((data) => {
        if (data.payload) {
          toast.success(`${product.name} quantity updated!`);
          dispatch(fetchCartItem(cartId));
        } else {
          toast.error("Failed to update cart");
        }
      });
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    const reviewData = {
      userId: userId,
      productId: product.id,
      rating: parseInt(newReview.rating),
      comment: newReview.comment,
      reviewDate: new Date(),
    };
    await dispatch(addNewReview({ reviewData })).then((data) => {
      // console.log(data);
      if (data) {
        toast.success("Review added successfully!");
        dispatch(fetchReview(product.id));
      }
    });

    // console.log("Review Submitted: ", reviewData);

    setShowReviewForm(false);
    setNewReview({ rating: 0, comment: "" });
  };
  const handleDeleteReview = async (reviewId) => {
    await dispatch(deleteReview(reviewId)).then((data) => {
      if (data.payload) {
        toast.success("Review deleted!");
        dispatch(fetchReview(product.id)).then((fetchedReviews) => {
          const updatedReviews = fetchedReviews.payload || [];
          
        });
      }
    });
  };

  const handleQuantityChange = (event, change) => {
    event.preventDefault();
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
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
          setQuantity(newQuantity); // Update local state
        } else {
          toast.error("Failed to update cart");
        }
      });
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <img
            src={`https://localhost:7152/${product.imageUrl}`}
            alt={product.name}
            className="img-fluid"
          />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <h4>Price: ₹{product.price}</h4>
          <p>
            <strong>Stock:</strong>{" "}
            {product.stock > 0 ? product.stock : "Out of Stock"}
          </p>
          {product.stock > 0 ? (
            <div>
              {!isInCart ? (
                <button
                  className="btn btn-success mt-3"
                  onClick={() => handleAddToCart(product.id, quantity)}
                >
                  Add to Cart
                </button>
              ) : (
                <div className="d-flex align-items-center mt-3">
                  <button
                    className="btn btn-danger"
                    onClick={(e) => handleQuantityChange(e, -1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="mx-3">{quantity}</span>
                  <button
                    className="btn btn-primary"
                    onClick={(e) => handleQuantityChange(e, 1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              )}
              <button
                className="btn btn-secondary mt-3 ms-2"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? "Cancel Review" : "Add Review"}
              </button>
            </div>
          ) : (
            <button className="btn btn-secondary mt-3" disabled>
              Out of Stock
            </button>
          )}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="mt-3">
              <div className="mb-2">
                <label>Rating:</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({ ...newReview, rating: e.target.value })
                  }
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-2">
                <label>Comment:</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className="form-control"
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Submit Review
              </button>
            </form>
          )}
          <hr />
          <h5>Reviews</h5>
          {reviewList.length > 0 ? (
            reviewList.map((review, index) => (
              <div key={index} className="review">
                <p>
                  <strong>{review.userName || "Anonymous"}</strong>:{" "}
                  {review.comment}
                </p>
                <p>Rating: {review.rating}/5</p>
                {review.userId === userId && (
                  <button
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    Delete Review
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
