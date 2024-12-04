// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllOrdersForUser } from "../../store/orderSlice";
// import ShoppingOrderDetailsView from "./order-details";

// const OrderHistory = () => {
//   const dispatch = useDispatch();
//   const { orderList, isLoading } = useSelector((state) => state.order); // Access orders from Redux state
//   const userId = parseInt(localStorage.userId);
//   console.log(userId);
//   useEffect(() => {
//     dispatch(fetchAllOrdersForUser({ userId })).then((data) => {
//       console.log(data);
//     });
//   }, [dispatch]);

//   if (isLoading) return <div>Loading...</div>;

//   // if (!orderList || orderList.length === 0) return <div>No orders found</div>;

//   // console.log(orderList);

//   return (
//     <div className="card">
//       <div className="card-header">Order History</div>
//       <div className="card-body">
//         <table className="table table-hover">
//           <thead>
//             <tr>
//               <th scope="col">Product</th>
//               <th scope="col">Date</th>
//               <th scope="col">Status</th>
//               <th scope="col">Price</th>
//               <th scope="col"></th>
//             </tr>
//           </thead>
//           <tbody>
//             {orderList && orderList.length > 0
//               ? orderList.map((order) => (
//                   <tr key={order.id}>
//                     <th scope="row"> {order.product.name}</th>
//                     <td>{new Date(order.orderDate).toLocaleDateString()}</td>
//                     <td>{order.orderStatus}</td>
//                     <td>${order.quantity * order.product.price}</td>
//                     <td>
//                       <ShoppingOrderDetailsView order={order} />
//                     </td>
//                   </tr>
//                 ))
//               : null}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default OrderHistory;


import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrdersForUser } from "../../service/orderSlice";
import ShoppingOrderDetailsView from "./order-details";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orderList, isLoading } = useSelector((state) => state.order);
  const userId = parseInt(localStorage.userId);

  useEffect(() => {
    dispatch(fetchAllOrdersForUser({ userId }));
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="card mt-4">
      <div className="card-header bg-dark text-white">Order History</div>
      <div className="card-body">
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
              <th scope="col">Price</th>
              <th scope="col">Details</th>
            </tr>
          </thead>
          <tbody>
            {orderList && orderList.length > 0 ? (
              orderList.map((order) => (
                <tr key={order.id}>
                  <td>{order.product.name}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${getStatusClass(order.orderStatus)}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>${order.quantity * order.product.price}</td>
                  <td>
                    <ShoppingOrderDetailsView order={order} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper function to return the color class for the status
const getStatusClass = (status) => {
  switch (status) {
    case "delivered":
      return "bg-success text-white"; // Green for delivered
    case "rejected":
      return "bg-danger text-white"; // Red for rejected
    case "InProcess":
      return "bg-warning text-dark"; // Yellow for pending
    case "InShipping":
      return "bg-info text-white"; // Blue for shipped
    default:
      return "bg-secondary text-white"; // Default gray
  }
};

export default OrderHistory;

                    