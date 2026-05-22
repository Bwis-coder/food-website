import "./profile.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import weburl from "../../config/weblink.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { StatsSection } from "./stats";

const Profile = ({ closeProfile }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [showLogout, setShowLogout] = useState(false);

  const logoutUser = async () => {
    await axios.post(`${weburl}/auth/logout`, {}, { withCredentials: true });
    navigate("/login");
    closeProfile();
  };

  const { data: userInfo, isLoading, error } = useQuery({
    queryKey: ["getUser"],
    queryFn: async () => {
      const res = await axios.get(`${weburl}/auth`, {
        withCredentials: true,
      });
      return res.data.data;
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
    refetchOnReconnect: true,
  });

  if (isLoading) return <h1>Fetching user data...</h1>;
  if (error) return <h1>something went wrong</h1>;
  if (!userInfo) return <h1>user information not found</h1>;

  return (
    <div className="profile-container">
      <p className="cancel" onClick={closeProfile}>
        X
      </p>

      <p
        className={activeTab === "info" ? "active-tab" : ""}
        onClick={() => setActiveTab("info")}
      >
        Profile
      </p>

      <p
        className={activeTab === "stats" ? "active-tab" : ""}
        onClick={() => setActiveTab("stats")}
      >
        Stats Section
      </p>

      <p onClick={() => navigate("/orders")}>Recent Orders</p>

      <p className="logout-btn" onClick={() => setShowLogout(true)}>
        Logout
      </p>

      {activeTab === "info" && (
        <div className="userInfo">
          <div className="avatar">{userInfo.name?.charAt(0)}</div>
          <h1>Hello {userInfo.name}</h1>
          <h3>UID: {userInfo.id}</h3>
          <h3>email: {userInfo.email}</h3>
          <h3>role: {userInfo.role}</h3>
          <h3>createdAt: {userInfo.createdAt}</h3>
        </div>
      )}

      {activeTab === "stats" && <StatsSection />}

      {showLogout && (
        <div className="logout-overlay">
          <div className="logout-modal">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to logout?</p>

            <div className="logout-actions">
              <button onClick={() => setShowLogout(false)}>
                Cancel
              </button>

              <button onClick={logoutUser}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Profile };