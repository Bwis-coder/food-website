import "./checkout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import weburl from "../../config/weblink";
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";

const Checkout = ({ getOrderItems }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const queryClient = useQueryClient();

  const pendingItems =
    getOrderItems?.filter((item) => item.order?.status === "PENDING") || [];

  const order = pendingItems[0]?.order;

  const updateOrder = useMutation({
    mutationFn: async (id) => {
      await axios.put(
        `${weburl}/orders/update/${id}`,
        {},
        {
          withCredentials: true,
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getOrderItems"],
      });
      queryClient.invalidateQueries({
        queryKey: ["foodItems"],
      });
    },
  });

  const deleteOrder = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${weburl}/orders/delete/${id}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getOrderItems"],
      });
      queryClient.invalidateQueries({
        queryKey: ["foodItems"],
      });
    },
  });

 const placeOrder = async () => {
  if (order) {
    setStatus(true);

    setTimeout(() => {
      navigate(`/orders/${order.id}`);
    }, 4000);
  }
};
  if (status) {
    return (
      <div className="statusLoading">
        <h1>Placing order...y</h1>
        <img src="/bean-eater.svg" alt="loading" />
      </div>
    );
  }
  if (!order) {
    return (
      <>
        <NavLink className="review-icon" to="/home">
          <FontAwesomeIcon icon={faHouse} />
        </NavLink>

        <div className="orderReview">
          <h1>No pending order to review</h1>
        </div>
      </>
    );
  }

  return (
    <div className="checkoutMain-container">
      <div className="nav-container">
        <NavLink className="nav-icon" to="/home">
          <FontAwesomeIcon icon={faHouse} />
        </NavLink>
      </div>

      <h1>Review your order</h1>

      <div className="payment-container">
        <h1>Payment Record</h1>

        <div>
          <p>Order total:</p>
          <h4>${order.totalPrice}</h4>
        </div>

        <div>
          <p>Status:</p>
          <h4>{order.status}</h4>
        </div>

        <button onClick={placeOrder}>Place your order</button>
      </div>

      {pendingItems &&
        pendingItems.map((item) => {
          return (
            <div className="productDetails-container" key={item.id}>
              <div>
                <img
                  className="productImage"
                  src={`${weburl}/${item.food.image}`}
                  alt={item.food.name}
                />
              </div>

              <div className="quantity-container">
                <p>{item.food.name}</p>

                <p>Price: ${item.price}</p>

                <div className="quantity-section">
                  <h3>Quantity: {item.quantity}</h3>

                  <div className="update-delete">
                    <span onClick={() => updateOrder.mutate(item.id)}>
                      Update
                    </span>

                    <span onClick={() => deleteOrder.mutate(item.id)}>
                      Delete
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export { Checkout };
