import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { workerContext } from "../WorkerContext/WorkerProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const authContext = createContext();

export default function AuthProvider({ children }) {
  const useAuth = process.env.REACT_APP_USE_AUTH === "true";
  const [userInfo, setUserInfo] = useState(null);
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

  const { worker } = useContext(workerContext);
  const navigate = useNavigate();

  const path = useLocation().pathname;

  // useEffect(() => {
  //   if (useAuth && !getRedirect()) {
  //     setRedirect(path);
  //   }
  // }, []);

  useEffect(() => {
    if (userInfo === null && useAuth) {
      setRedirect(path);
      navigate("/login");
    }
  }, [userInfo]);

  useEffect(
    () => () => {
      localStorage.clear();
    },
    []
  );

  const storeAccessToken = (codeResponse) => {
    //   const expiry = codeResponse.expires_in * 1000;
    //   setTimeout(
    //     () => alert("Your session will expire in one minute."),
    //     expiry - 60000
    //   );
    //   setTimeout(handleSignOut, expiry);
    worker?.postMessage({
      type: "storeToken",
      args: codeResponse.access_token,
      url: process.env.REACT_APP_API_ENDPOINT_AUTH,
    });
    getReport("test");
  };

  const getRedirect = () => {
    return localStorage.getItem("redirect");
  };
  console.log("ARE WE AUTH: ", useAuth, getRedirect());

  const setRedirect = (url) => {
    console.log("setting redirect to ", url);
    localStorage.setItem("redirect", url === "/login" ? "/" : url);
    console.log("getRedirect:", getRedirect());
  };

  const clearToken = () => {
    worker?.postMessage({ type: "clearToken" });
  };

  const getUserInfo = () => {
    worker?.postMessage({ type: "userRequest" });
  };

  const getReport = () => {
    worker?.postMessage({ data: "TEST HERE PLEASE", type: "report" });
  };

  const AuthStore = {
    userInfo,
    setUserInfo,
    storeAccessToken,
    getRedirect,
    setRedirect,
    clearToken,
    getUserInfo,
  };
  return useAuth ? (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <authContext.Provider value={AuthStore}>{children}</authContext.Provider>{" "}
    </GoogleOAuthProvider>
  ) : (
    children
  );
}
