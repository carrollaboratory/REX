// import { worker } from "../AuthContext/AuthStore";
// export const storeAccessToken = (codeResponse) => {
//   const expiry = codeResponse.expires_in * 1000;
//   setTimeout(
//     () => alert("Your session will expire in one minute."),
//     expiry - 60000
//   );
//   setTimeout(handleSignOut, expiry);
//   worker?.postMessage({
//     type: "storeToken",
//     args: codeResponse.access_token,
//     url: URL,
//   });
// };

// export const clearToken = () => {
//   worker?.postMessage({ type: "clearToken" });
// };

// export const getUserInfo = () => {
//   worker?.postMessage({ type: "userRequest" });
// };

// export const setUserInfo = setUserInfo;
