import axios from "axios";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import weburl from "../../config/weblink.js";
import "./login.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const signUp = async (post) => {
  const res = await axios.post(
    `${weburl}/auth/login`,
    {
      email: post.email,
      password: post.password,
    },
    { withCredentials: true }
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
          <h1 className="greeting-message">
            Welcome back to Bwis Restaurant
          </h1>
          <p>please enter your details</p>
        </div>

        <h5>Email</h5>
        <input
          className="userEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <h5>Password</h5>
        <input
          className="userPassword"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <NavLink to="/findMail">
          <h3>Forgot password?</h3>
        </NavLink>

        <button className="register-button" type="submit">
          Login
        </button>

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