import { useContext } from "react";
import "./navBar.css";
import { NavBarAuth } from "./navBarAuth";
import { NavBarPublic } from "./navBarPublic";
import { authContext } from "../AuthContext/AuthProvider";
import { Link, useLocation } from "react-router-dom";
import AnvilLogo from "../../images/anvil.png";
import { myContext } from "../AppFHIR";

const useAuth = process.env.REACT_APP_USE_AUTH === "true";

export const NavBar = () => {
  const authContextVar = useContext(authContext);
  const { handleSignOut } = useContext(myContext);
  const location = useLocation();
  const loginPage = location.pathname == "/login";
  // console.log("ALLNAV: ", userInfo);
  return (
    <>
      {!loginPage ? (
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
              <Link
                to="/"
                className="nav-link"
                // onClick={() => {
                //   setActive(0);
                // }}
                // style={{
                //   backgroundColor: active === 0 ? "#F2F2F2" : "",
                // }}
              >
                <li className="nav-items">All Studies</li>
              </Link>

              <Link
                to="/dataDictionary"
                className="nav-link"
                // onClick={() => {
                //   setActive(1);
                // }}
                // style={{
                //   backgroundColor: active === 1 ? "#F2F2F2" : "",
                // }}
              >
                <li className="nav-items">Data Dictionaries</li>
              </Link>
            </div>
            {useAuth ? (
              <div className="nav-user-wrapper">
                <li className="nav-user-info">
                  <img
                    className="nav-user-picture"
                    alt="user's Google profile image"
                    src={authContextVar.userInfo?.picture}
                  />{" "}
                  {authContextVar.userInfo?.email}
                </li>
                <button
                  className="sign-out-button"
                  onClick={() => {
                    handleSignOut();
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="nav-user-wrapper"></div>
            )}
          </ul>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
