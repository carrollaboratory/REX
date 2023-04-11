import { Link } from "react-router-dom";
import AnvilLogo from "../../images/anvil-logo.png";
import "./navBar.css";

export const NavBar = () => {
  return (
    <ul className="navbar">
      <li className="nav-logo">
        <Link to="/">
          <img className="nav-logo-image" src={AnvilLogo} />
        </Link>
      </li>
    </ul>
  );
};
