import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import weburl from "../../config/weblink.js";
import "./stats.css";

const StatsSection = () => {
  const {
    data: userInfo,
    isLoading,
    error,
  } = useQuery({
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

  let totalSpent = 0;

  userInfo.orders.forEach((order) => {
    totalSpent += order.totalPrice;
  });

  return (
    <div className="stats-section">
      <h2>Stats</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{userInfo.orders.length}</p>
        </div>

        <div className="stat-card">
          <h3>Total Spent</h3>
          <p>${totalSpent}</p>
        </div>

        <div className="stat-card">
          <h3>Confirmed</h3>
          <p>
            {
              userInfo.orders.filter((order) => order.status === "CONFIRMED")
                .length
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export { StatsSection };
