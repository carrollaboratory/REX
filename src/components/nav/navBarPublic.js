import { Link } from "react-router-dom";
import AnvilLogo from "../../images/anvil.png";
import "./navBar.css";

export const NavBarPublic = () => {
  return (
    <>
      <div className="navbar-wrapper">
        <ul className="navbar">
          <li className="nav-logo">
            <Link to="/">
              <img
                className="nav-logo-image"
                alt="AnVIL logo"
                src={AnvilLogo}
              />
            </Link>
          </li>
          <div className="nav-items-wrapper">
            <Link to="/" className="nav-link">
              <li className="nav-items">All Studies</li>
            </Link>

            <Link to="/dataDictionary" className="nav-link">
              <li className="nav-items">Data Dictionaries</li>
            </Link>
          </div>
        </ul>
      </div>
    </>
  );
};
{
}
