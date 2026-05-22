import "./homesubsection.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faPhone,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
const SubSection = () => {
  return (
    <div className="subsection-container">
      <div className="contactAddress">
        <p>CONTACT US</p>
        <div className="contact-info">
          <span>
            <FontAwesomeIcon icon={faLocationDot} />
          </span>
          <span>Location: 23 Aba Road, Port Harcourt, Rivers State, Nigeria</span>
        </div>

        <div className="contact-info">
          <span>
            <FontAwesomeIcon icon={faPhone} />
          </span>
          <p> +2349037455456</p>
        </div>

        <div className="contact-info">
         <span> <FontAwesomeIcon icon={faMessage} /></span>
          <p>wisdomezekiel9@gmail.com</p>
        </div>
      </div>

      <div className="our-link">
        <p>OUR LINKS</p>
        <a href="https://instagram.com/bwis_tech" target="_blank">
          <h1><FontAwesomeIcon icon={faInstagram} /></h1>
        </a>
        <a
          href="https://wa.me/2349037455456"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h1><FontAwesomeIcon icon={faWhatsapp} /></h1>
        </a>
      </div>

      <div className="our-services">
        <h1>OUR SERVICES</h1>
        <p>Awesome Team</p>
        <p>Table Services</p>
        <p>order Taken</p>
        <p>Quick Delivery</p>
        <p>Fresh Healthy Food</p>
      </div>
    </div>
  );
};

export { SubSection };
