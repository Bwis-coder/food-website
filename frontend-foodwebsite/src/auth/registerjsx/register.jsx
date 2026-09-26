import axios from "axios";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./register.css";
import weburl from "../../config/weblink";
import profile from "/profile.svg";
import lock from "/lock.svg";

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

    if (!name || !email || !password) {
      setnotice("please complete all the fields");
      return;
    }

    setLoading(true);
    setStatus(true);

    try {
      await axios.post(`${weburl}/auth/register`, {
        name,
        email,
        password,
      });

      setName("");
      setEmail("");
      setPassword("");

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
      <div className="hero-section">
        <div className="greeting-message">
          <h1>Create Your Account</h1>
          <span>Start ordering delicious meals today</span>
        </div>

        <span>please enter your details</span>
      </div>

      <form onSubmit={signUp} className="my-form">
        <div className="form-container">
          <div>
            <label htmlFor="name">
              <img src={profile} alt="profile" />
            </label>

            <input
              id="name"
              className="userName"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email">@</label>

            <input
              id="email"
              className="userEmail"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password">
              <img src={lock} alt="lock" />
            </label>

            <input
              id="password"
              className="userPassword"
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              className="register-button"
              disabled={loading}
              type="submit"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </div>
        </div>
      </form>

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
    </div>
  );
};

export { Register };
