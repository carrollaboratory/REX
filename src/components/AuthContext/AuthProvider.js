import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { workerContext } from "../WorkerContext/WorkerProvider";

export const authContext = createContext();
export const getRedirect = () => {
  return localStorage.getItem("redirect");
};
export default function AuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);

  const { worker } = useContext(workerContext);
  const navigate = useNavigate();

  const path = useLocation().pathname;
  const URL = process.env.REACT_APP_API_ENDPOINT;
  // const expiry = codeResponse.expires_in * 1000;
  // setTimeout(
  //   () => alert("Your session will expire in one minute."),
  //   expiry - 60000
  // );
  // setTimeout(handleSignOut, expiry);
  const storeAccessToken = (codeResponse) => {
    worker?.postMessage({
      type: "storeToken",
      args: codeResponse.access_token,
      url: URL,
    });
  };

  const setRedirect = (url) => {
    localStorage.setItem("redirect", url === "/login" ? "/" : url);
  };

  useEffect(() => {
    if (!getRedirect()) {
      setRedirect(path);
    }
  }, []);

  const getUserInfo = () => {
    worker?.postMessage({ type: "userRequest" });
  };

  // useEffect(
  //   () => () => {
  //     handleSignOut();
  //     setSelectedStudy(undefined);
  //     setSelectedReference(undefined);
  //     localStorage.clear();
  //   },
  //   []
  // );

  useEffect(() => {
    userInfo === null && navigate("/login");
  }, [userInfo]);

  const AuthStore = {
    storeAccessToken,
    getUserInfo,
    setUserInfo,
    userInfo,
    getRedirect,
    setRedirect,
    // path,
  };
  return (
    <authContext.Provider value={AuthStore}>{children}</authContext.Provider>
  );
}
