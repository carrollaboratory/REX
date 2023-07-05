let accessToken;

onmessage = (event) => {
  const { type, token } = event.data;

  if (type === "storeToken") {
    accessToken = token;
    postMessage({ type: "loggedIn" });
  } else if (type === "userRequest") {
    fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => postMessage({ type: "user", data }));
  } else if (type === "clearToken") {
    //send token back to main thread
  } else if (type === "tableRequest") {
    fetch(process.env.REACT_APP_API_ENDPOINT + "/ResearchStudy?_count=500", {
      method: "GET",
      headers: {
        "Content-Type": "application/fhir+json; fhirVersion=4.0",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => postMessage({ type: "table", data }));
  }
};
