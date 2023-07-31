import { useContext, useEffect } from "react";
import { authContext } from "../../App";
import AnvilLogo from "../../images/anvil.png";
import AnvilSmallLogo from "../../images/AnVIL_Little_Logo.png";
import GoogleLoginButton from "../../images/btn_google_signin_light_focus_web.png";
import "./login.css";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

export const Login = () => {
  const { storeAccessToken, client, setClient } = useContext(authContext);

  const google = window.google;

  const callbackResponse = (tokenResponse) => {
    if (tokenResponse && tokenResponse.access_token) {
      if (
        google.accounts.oauth2.hasGrantedAnyScope(
          tokenResponse,
          "https://www.googleapis.com/auth/cloud-platform",
          "https://www.googleapis.com/auth/userinfo.email"
        )
      ) {
        storeAccessToken(tokenResponse.access_token);
      }
    }
  };
  const handleSignInError = (error) => {
    console.log("ERROR", error);
  };

  const handleSignIn = () => {
    const c = google?.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope:
        "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/userinfo.email",
      callback: callbackResponse,
      error_callback: handleSignInError,
    });
    setClient(c);

    c?.requestAccessToken();
  };

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
              alt="Google loggin button"
              onClick={handleSignIn}
              src={GoogleLoginButton}
            />
          </div>
          {/* <div className="login-trouble-div"> */}
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
