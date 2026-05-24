import "./orders.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartFlatbed, faHouse } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import weburl from "../../config/weblink.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const Orders = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orderbyId", id],
    queryFn: async () => {
      const res = await axios.get(`${weburl}/orders/placeOrders/${id}`, {
        withCredentials: true,
      });
      return res.data.data;
    },
  });

  useEffect(() => {
    if (order) {
      queryClient.invalidateQueries({ queryKey: ["getOrderItems"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    }
  }, [order, queryClient]);
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <h2>Loading order...</h2>
      </div>
    );
  }
  if (isError || !order) {
    return (
      <div className="subhead-container">
        <div className="Navigation-container">
          <div className="Icon">
            <NavLink to="/home">
              <FontAwesomeIcon icon={faHouse} />
            </NavLink>
            <p>home</p>
          </div>

          <div className="Icon">
            <NavLink to="/checkout">
              <FontAwesomeIcon icon={faCartFlatbed} />
            </NavLink>
            <p>checkout Page</p>
          </div>
        </div>

        <h1 className="greet">No order found</h1>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="Navigation-container">
        <div className="Icon">
          <NavLink to="/home">
            <FontAwesomeIcon icon={faHouse} />
          </NavLink>
          <p>home</p>
        </div>

        <div className="Icon">
          <NavLink to="/checkout">
            <FontAwesomeIcon icon={faCartFlatbed} />
          </NavLink>
          <p>checkout Page</p>
        </div>
      </div>

      <div className="order-hero-section">
        <h1>ORDER SUMMARY</h1>

        <div className="orderDetails">
          <p>Order ID: {order.id}</p>
          <p>Status: {order.status}</p>
          <p>Total: ${order.totalPrice}</p>
          <p>Payment: Pay on Delivery</p>
          <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="order-items">
        <h1>ORDER ITEMS</h1>

        {order.orderItem.map((item) => {
          const total = item.price * item.quantity;

          return (
            <div className="foodItems" key={item.id}>
              <img src={`${weburl}/${item.food.image}`} alt={item.food.name} />

              <span>{item.food.name}</span>
              <span>x{item.quantity}</span>
              <span>${item.price} each</span>
              <span>${total}</span>
            </div>
          );
        })}
      </div>

      <div className="order-total">
        <h1>TOTAL</h1>
        <h5>Total Price: ${order.totalPrice}</h5>
      </div>
    </div>
  );
};

export { Orders };
