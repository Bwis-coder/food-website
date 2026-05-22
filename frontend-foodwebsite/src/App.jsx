import { Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AdminPage } from "./pages/adminPage/adminPage";
import { Register } from "./auth/registerjsx/register";
import { Login } from "./auth/loginjsx/login";
import { Home } from "./pages/homepagejsx/home";
import { PasswordReset } from "./auth/password-reset/passwordRest";
import { Checkout } from "./pages/checkoutpage/checkout";
import { Orders } from "./pages/orderPage/order";
import { OrderMainPage } from "./pages/orderPage/orderMainPage";
import { StatsSection } from "./pages/profilePage/stats";
import weburl from "./config/weblink";

function App() {
  const {
    data: getOrderItems = [],
    isLoading: ordersLoading,
    isError: ordersError,
  } = useQuery({
    queryKey: ["getOrderItems"],
    queryFn: async () => {
      const response = await axios.get(`${weburl}/orders/getOrderItem`, {
        withCredentials: true,
      });
      return response.data.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return (
    <Routes>
      <Route index element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/home"
        element={
          <Home getOrderItems={getOrderItems} ordersLoading={ordersLoading} />
        }
      />
      <Route path="/password-reset" element={<PasswordReset />} />
      <Route
        path="/checkout"
        element={
          <Checkout
            getOrderItems={getOrderItems}
            ordersLoading={ordersLoading}
          />
        }
      />
      <Route path="/orders/:id" element={<Orders />} />
      <Route path="/stats-section" element={<StatsSection />} />
      <Route path="/orders" element={<OrderMainPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
