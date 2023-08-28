import { useContext } from "react";
import AnvilLogo from "../../images/anvil.png";
import AnvilSmallLogo from "../../images/AnVIL_Little_Logo.png";
import GoogleLoginButton from "../../images/btn_google_signin_light_focus_web.png";
import "./login.css";
import { useGoogleLogin, GoogleLogin } from "@react-oauth/google";
import { authContext } from "../AuthContext/AuthProvider";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

export const Login = () => {
  const { storeAccessToken } = useContext(authContext);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      storeAccessToken(codeResponse);
    },
    onError: (error) => {
      console.log("ERROR ", error);
    },
  });

  console.log("RENDER LOGIN!");

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
