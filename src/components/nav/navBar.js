import { Link } from "react-router-dom";
import AnvilLogo from "../../images/anvil.png";
import "./navBar.css";
import { useEffect, useState, useContext } from "react";
import { authContext } from "../../App";

export const NavBar = () => {
  const { getUserInfo, userInfo } = useContext(authContext);
  const { handleSignOut } = useContext(authContext);

  // useEffect(() => {
  //   getUserInfo();
  // }, []);

  const [active, setActive] = useState(-1);
  return (
    <>
      {userInfo ? (
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
            <div className="nav-user-wrapper">
              <li className="nav-user-info">
                <img
                  className="nav-user-picture"
                  alt="user's Google profile image"
                  src={userInfo?.picture}
                />{" "}
                {userInfo?.email}
              </li>
              <button
                className="sign-out-button"
                onClick={() => handleSignOut()}
              >
                Sign Out
              </button>
            </div>
          </ul>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
{
}
