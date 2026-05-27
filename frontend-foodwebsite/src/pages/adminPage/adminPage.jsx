import "./adminPage.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartArrowDown,
  faDollarSign,
  faPeopleCarryBox,
  faCheck,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import weburl from "../../config/weblink.js";
import { useNavigate, NavLink } from "react-router-dom";

const AdminPage = () => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: getAdminOrder,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin"],
    queryFn: async () => {
      const res = await axios.get(`${weburl}/admin/confirm-orders`, {
        withCredentials: true,
      });
      return res.data.data;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const updateOrderStatus = async (id) => {
    try {
      await axios.put(
        `${weburl}/admin/updateStatus/${id}`,
        {},
        { withCredentials: true },
      );

      setShowDetails(null);
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
    } catch (error) {
      console.log(error);
    }
  };

  const logOutFn = async () => {
    try {
      await axios.post(`${weburl}/auth/logout`, {}, { withCredentials: true });
      queryClient.clear();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <h1 className="pageStatus">loading data....</h1>;
  if (error)
    return (
      <div className="admin-header">
        <NavLink to="/home" className="admin-home-link">
          <FontAwesomeIcon icon={faHouse} />
          <span>Home</span>
        </NavLink>
        <h1 className="pageStatus">something went wrong</h1>;
      </div>
    );

  if (!getAdminOrder || getAdminOrder.length === 0)
    return <h1 className="pageStatus">No order yet from the customers</h1>;

  const adminUser = getAdminOrder.find(
    (order) => order.user?.role === "ADMIN",
  )?.user;

  const uniqueUsers = new Set(getAdminOrder.map((item) => item.user.id));

  const totalUser = uniqueUsers.size;

  const totalOrder = getAdminOrder.length;

  let totalPrice = 0;
  getAdminOrder.forEach((item) => {
    totalPrice += item.totalPrice;
  });

  return (
    <div className="admin-main-container">
      <div className="admin-header">
        <NavLink to="/home" className="admin-home-link">
          <FontAwesomeIcon icon={faHouse} />
          <span>Home</span>
        </NavLink>
      </div>

      {adminUser && (
        <h1 className="admin">HELLO ADMIN {adminUser.name.toUpperCase()}</h1>
      )}

      <div className="header">
        <h1>
          <FontAwesomeIcon icon={faCartArrowDown} />
          Total order: {totalOrder}
        </h1>

        <h1>
          <FontAwesomeIcon icon={faDollarSign} />
          Revenue: ${totalPrice}
        </h1>

        <h1>
          <FontAwesomeIcon icon={faPeopleCarryBox} />
          Customers:{totalUser}+
        </h1>

        <h1>
          <FontAwesomeIcon icon={faCheck} />
          Confirmed Orders : {totalOrder}
        </h1>
      </div>

      <div className="admin-middle-section">
        <div className="middle-section-header">
          <table className="admin-user-info">
            <thead>
              <tr>
                <th>User</th>
                <th>Order ID</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {getAdminOrder.map((order) => (
                <tr className="userDetails" key={order.id}>
                  <td>{order.user.name}</td>
                  <td>{order.id}</td>
                  <td>
                    {order.orderItem.map((item) => item.food?.name).join(", ")}
                  </td>
                  <td>${order.totalPrice}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => setShowDetails(order)}>
                      order details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showDetails && (
          <div className="cutomers-details">
            <h3 onClick={() => setShowDetails(null)}>X</h3>

            <h1>Order ID: {showDetails.id}</h1>

            <div>
              <h4>Customer Info</h4>
              <span>{showDetails.user.name}</span>
              <span>{showDetails.user.email}</span>
            </div>

            <div>
              <h4>Item Ordered</h4>
              <span>
                {showDetails.orderItem
                  .map((item) => item.food?.name)
                  .join(", ")}
              </span>
            </div>

            <div>
              <h4>Total Price</h4>
              <span>{showDetails.totalPrice}</span>
            </div>

            <div>
              <h4>Status</h4>
              <span>{showDetails.status}</span>
            </div>

            <div>
              <h4>Order Date</h4>
              <span>
                {new Date(showDetails.createdAt).toLocaleDateString()}
              </span>
            </div>

            <button onClick={() => updateOrderStatus(showDetails.id)}>
              mark as successful
            </button>
          </div>
        )}
      </div>

      <div>
        <button onClick={logOutFn} className="logout-button">
          Log out
        </button>
      </div>
    </div>
  );
};

export { AdminPage };
