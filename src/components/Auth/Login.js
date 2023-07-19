import { useContext } from "react";
import { authContext } from "../../App";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

export const Login = () => {
  const { storeAccessToken, handleSignOut } = useContext(authContext);

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
      {/* <button onClick={() => handleSignOut()}>Sign Out</button> */}
    </div>
  );
};
