import { useContext, useEffect, useState } from "react";
import { authContext, myContext } from "../../App";
import AnvilLogo from "../../images/anvil.png";
import AnvilSmallLogo from "../../images/AnVIL_Little_Logo.png";
import GoogleLoginButton from "../../images/btn_google_signin_light_focus_web.png";
import "./login.css";
import { useGoogleLogin, GoogleLogin } from "@react-oauth/google";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

export const Login = () => {
  const { storeAccessToken, client, setClient, userInfo, getTokenExpiration } =
    useContext(authContext);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      storeAccessToken(codeResponse);
    },
  });

  return (
    <>
      <div className="login-wrapper">
        <div className="left-side">
          <img className="anvil-logo" alt="AnVIL logo" src={AnvilLogo} />
        </div>
        <div className="right-side">
          <div className="login-gregor">AnVIL Data Resource Portal:</div>
          <div className="login-gregor">GREGoR Consortium Workspace</div>
          <div>
            <img
              className="login-button"
              alt="Google login button"
              onClick={login}
              src={GoogleLoginButton}
            />
          </div>
          <div className="login-trouble">
            <p className="login-trouble-question">Having trouble logging in?</p>
            Contact your access manager,<br></br>
            <a href="mailto:bheavner@uw.edu" className="login-link">
              Ben Heavner
            </a>
            , for further assistance.
          </div>

          <div className="anvil-small-logo-div">
            <img
              className="anvil-small-logo"
              alt="Small AnVIL logo"
              src={AnvilSmallLogo}
            />
          </div>
        </div>
      </div>
    </>
  );
};
