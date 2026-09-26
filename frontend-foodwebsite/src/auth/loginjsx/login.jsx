import axios from "axios";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import weburl from "../../config/weblink.js";
import "./login.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import profile from "/profile.svg";
import lock from "/lock.svg";

const signUp = async (post) => {
  const res = await axios.post(
    `${weburl}/auth/login`,
    {
      email: post.email,
      password: post.password,
    },
    { withCredentials: true },
  );

  return res.data;
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setnotice] = useState("");
  const [status, setStatus] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: signUp,

    onMutate: () => {
      setStatus(true);
    },

    onSuccess: () => {
      setEmail("");
      setPassword("");
      navigate("/home");

      queryClient.invalidateQueries({
        queryKey: ["getOrderItems"],
      });

      setStatus(false);
    },

    onError: (error) => {
      setnotice(error.response?.data?.message || "something went wrong");
      setStatus(false);
    },
  });

  if (status) {
    return (
      <div className="statusLoading">
        <img src="/bean-eater.svg" alt="loading" />
        <p>Logging you in...</p>
      </div>
    );
  }

  return (
    <div className="register-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!email || !password) {
            setnotice("please complete all the fields");
            return;
          }

          mutate({ email, password });
        }}
      >
        <div className="hero-section">
          <div className="greeting-message">
            <h1>Welcome Back</h1>
            <span>Welcome back to Bwis Restaurant</span>
          </div>

          <span>please enter your details</span>
        </div>

        <div className="form-container">
          <div>
            <label htmlFor="email">
              <img src={profile} alt="email" />
            </label>

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
              <img src={lock} alt="password" />
            </label>

            <input
              id="password"
              className="userPassword"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <NavLink to="/findMail">
            <h3>Forgot password?</h3>
          </NavLink>

          <button className="register-button" type="submit">
            Login
          </button>
        </div>

        <div className="notice" style={{ color: "red" }}>
          {notice}

          <div>
            <NavLink to="/">
              <p className="sign-up">
                Don't have an account? <span>Sign up</span>
              </p>
            </NavLink>
          </div>
        </div>
      </form>
    </div>
  );
};

export { Login };
