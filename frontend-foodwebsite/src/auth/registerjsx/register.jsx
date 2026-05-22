import axios from "axios";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./register.css";
import weburl from "../../config/weblink";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setnotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);

  const navigate = useNavigate();

  const signUp = async (e) => {
    e.preventDefault();

    if (name === "" || email === "" || password === "") {
      setnotice("please complete all the fields");
      return;
    }

    setLoading(true);
    setStatus(true);

    try {
      await axios.post(`${weburl}/auth/register`, {
        name: name,
        email: email,
        password: password,
      });
      setName("");
      setPassword("");
      setEmail("");

      navigate("/login");
    } catch (error) {
      setnotice(
        error.response?.data?.message ||
          "user account already exist please login",
      );
    } finally {
      setLoading(false);
      setStatus(false);
    }
  };

  if (status) {
    return (
      <div className="statusLoading">
        <img src="/bean-eater.svg" alt="loading" />
        <p>Creating account...</p>
      </div>
    );
  }
  return (
    <div className="register-container">
      <form onSubmit={signUp} className="my-form">
        <div className="hero-section">
          <h1 className="greeting-message">
            “Create Your Account”
            <span>Start ordering delicious meals today</span>
          </h1>
          <p>please enter your details</p>
        </div>

        <h5>Name</h5>
        <input
          className="userName"
          placeholder="Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
        />

        <h5>Email</h5>
        <input
          className="userEmail"
          placeholder="Enter your email"
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        />

        <h5>Password</h5>
        <input
          className="userPassword"
          placeholder="password"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
        />

        <button className="register-button" disabled={loading} type="submit">
          {loading ? "Creating account..." : "Register"}
        </button>

        <div className="notice" style={{ color: "red" }}>
          {notice}

          <div>
            <NavLink to="/login">
              <p className="sign-up">
                Already have an account? <span>Sign in</span>
              </p>
            </NavLink>
          </div>
        </div>
      </form>
    </div>
  );
};

export { Register };
