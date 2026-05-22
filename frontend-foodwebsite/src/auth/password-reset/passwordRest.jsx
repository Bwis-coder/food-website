import axios from "axios";
import weburl from "../../config/weblink";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./passwordRest.css";

const PasswordReset = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const sentToken = query.get("token");
  const getMail = query.get("email");

  //usestate
  const [email, setEmail] = useState(getMail || "");
  const [token, setToken] = useState(sentToken || "");
  const [newPassword, setNewPassword] = useState("");
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();
  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword === "" || token === "") {
      return setNotice("please fill all fields");
    }
    try {
      await axios.put(`${weburl}/auth/resetPassWord`, {
        email,
        token,
        password: newPassword,
      });
      setEmail("");
      setNewPassword("");
      setToken("");
      setNotice("password reset successful you can now login");
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (error) {
      setNotice(error.response?.data?.message || "something went wrong");
    }
  };
  return (
    <div className="container-passwordReset">
      <form onSubmit={resetPassword}>
        <h1>Reset Password</h1>
        <input
          type="email"
          placeholder="enter registered email"
          value={email}
          readOnly
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="enter token"
          onChange={(e) => {
            setToken(e.target.value);
          }}
          value={token}
          readOnly
        />
        <input
          type="password"
          placeholder="New password"
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
          value={newPassword}
        />
        <h5>Must be at least 6 characters</h5>
        
        <button type="submit">Change Password </button>
        <h6 style={{color:"red"}}>{notice}</h6>
      </form>
    </div>
  );
};

export { PasswordReset };
