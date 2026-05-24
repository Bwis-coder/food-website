import "./orders.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartFlatbed, faHouse } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import axios from "axios";
import weburl from "../../config/weblink.js";
import { useQuery } from "@tanstack/react-query";

const OrderMainPage = () => {
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getOrders"],
    queryFn: async () => {
      const res = await axios.get(`${weburl}/orders/getOrder`, {
        withCredentials: true,
      });
      return res.data.data;
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnReconnect: true,
  });

  if (isLoading) {
    return (
      <div className="loading-container">
        <link rel="icon" type="image/svg+xml" href="orders-favicon.png" />

        <h2>Loading order...</h2>
      </div>
    );
  }

  if (isError) {
    return <h1>Failed to load orders</h1>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="subhead-container">
        <link rel="icon" type="image/svg+xml" href="orders-favicon.png" />

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

        <h1 className="greet">please kindly place an order</h1>
      </div>
    );
  }

  return (
    <div className="orders-container">
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
      </div>

      {orders.map((order) => (
        <div key={order.id}>
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
                  <img src={`${weburl}/${item.food.image}`} />
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
            <h5>Total Price : ${order.totalPrice}</h5>
          </div>
        </div>
      ))}
    </div>
  );
};

export { OrderMainPage };
