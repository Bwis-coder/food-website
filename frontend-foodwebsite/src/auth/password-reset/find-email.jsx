import axios from "axios";
import weburl from "../../config/weblink";
import { useState } from "react";
import "./findmail.css";
const FindMail = () => {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const verifyMail = async (e) => {
    e.preventDefault();
    if (email === "") {
      return setNotice("please enter your email");
    }
    try {
      await axios.post(`${weburl}/auth/checkEmail`, {
        email,
      });
      setEmail("");
      setNotice("mail sent");
    } catch (error) {
      setNotice(error.response?.data?.message || "something went wrong");
    }
  };
  return (
    <div className="mail-container">
      <form onSubmit={verifyMail}>
        <h1>Find your account</h1>

        <p>Enter your registered email address</p>

        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="email"
          placeholder="Email address"
        />

        <button type="submit">send Code</button>
        <div style={{ color: "red" }}>{notice}</div>
      </form>
    </div>
  );
};

export { FindMail };
