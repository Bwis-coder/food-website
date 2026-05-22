import { useState, useEffect } from "react";
import bwisLogo from "../../assets/bwisLogo.PNG";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartFlatbed,
  faUser,
  faMagnifyingGlass,
  faHouse,
  faUserTie,
  faCartArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import "./header.css";

const Header = ({ getOrderItems, openSearch, openProfile }) => {
  const messages = [
    "Order your favorite food anytime, anywhere",
    "Order delicious food anytime, anywhere (English vibe)",
    "Ordena tu comida favorita en cualquier momento, en cualquier lugar (Spanish)",
    "Bestelle dein Lieblingsessen jederzeit und überall (German)",
    "Have you eaten today? Order now!",
    "You don chop? Order now!",
    "Ka ci abinci? (Hausa) Order now!",
    "Ị riela nri? (Igbo) Order now!",
    "Se o ti jẹun? (Yoruba) Order now!",
    "No cap, you hungry fr. Order now!",
  ];

  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [messages.length]);

  const pendingItems =
    getOrderItems?.filter((item) => item.order?.status === "PENDING") || [];

  let quantityValue = 0;

  pendingItems.forEach((item) => {
    quantityValue += Number(item.quantity || 0);
  });

  const user = getOrderItems?.[0]?.food?.createdBy;

  const statusDisplay =
    user?.role === "ADMIN" ? (
      <NavLink to="/admin" className="order-link">
        <h2>
          <FontAwesomeIcon icon={faUserTie} />
        </h2>
        <div>admin</div>
      </NavLink>
    ) : (
      <NavLink to="/home" className="order-link">
        <h2>
          <FontAwesomeIcon icon={faHouse} />
        </h2>
        <div>home</div>
      </NavLink>
    );

  return (
    <div className="hero-section-container">
      <div className="hero-sub-container">
        <img src={bwisLogo} />

        <div className="navbar">
          {statusDisplay}

          <NavLink to="/orders" className="order-link">
            <h2>
              <FontAwesomeIcon icon={faCartArrowDown} />
            </h2>
            <div>orders</div>
          </NavLink>

          <NavLink to="/checkout" className="navIcon">
            <p>{quantityValue}</p>
            <FontAwesomeIcon icon={faCartFlatbed} />
            <div>checkout</div>
          </NavLink>

          <div onClick={openSearch} className="navIcon">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <div>Search</div>
          </div>

          <NavLink className="navIcon" onClick={openProfile}>
            <FontAwesomeIcon icon={faUser} />
            <div>profile</div>
          </NavLink>
        </div>
      </div>

      <h1 className="homeWriteUp">{messages[textIndex]}</h1>
    </div>
  );
};

export { Header };
