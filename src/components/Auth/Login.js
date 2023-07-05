import { useContext } from "react";
import { authContext } from "../../App";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

export const Login = () => {
  const { storeAccessToken } = useContext(authContext);

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
        // console.log("STORING", tokenResponse.access_token);
        storeAccessToken(tokenResponse.access_token);
      }
    }
  };

  const handleSignIn = () => {
    let client = google?.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope:
        "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/userinfo.email",
      callback: callbackResponse,
    });
    client?.requestAccessToken();
  };

  return (
    <div>
      <button onClick={handleSignIn}>Sign in with Google</button>
    </div>
  );
};
