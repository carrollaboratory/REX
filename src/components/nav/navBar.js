import { Link } from "react-router-dom";
import AnvilLogo from "../../images/anvil-logo.png";
import "./navBar.css";
import { useEffect, useState } from "react";

export const NavBar = () => {
  const [active, setActive] = useState(-1);
  return (
    <div className="navbar-wrapper">
      <ul className="navbar">
        <li className="nav-logo">
          <Link to="/">
            <img className="nav-logo-image" src={AnvilLogo} />
          </Link>
        </li>
        <div className="nav-items-wrapper">
          <a
            href="/"
            className="nav-link"
            onClick={() => {
              setActive(0);
            }}
            style={{
              backgroundColor: active === 0 ? "#E7EEF0" : "",
            }}
          >
            <li className="nav-items">All Studies</li>
          </a>

          <a
            href="/dataDictionary"
            className="nav-link"
            onClick={() => {
              setActive(1);
            }}
            style={{
              backgroundColor: active === 1 ? "#E7EEF0" : "",
            }}
          >
            <li className="nav-items">Data Dictionaries</li>
          </a>
        </div>
      </ul>
    </div>
  );
};
