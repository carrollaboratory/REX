import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { createContext, useState, useEffect, useContext } from "react";
import Table from "./tables/table";
import { NavBar } from "./nav/navBar";
import DetailsView from "./tables/details";
import DataDictionary from "./DataDictionaries/dataDictionary";
import DataDictionaryReferences from "./DataDictionaries/dataDictionaryReferences";
import { VariableSummary } from "./VariableSummaries/variableSummary";
import { Login } from "./Auth/Login";
import { Variables } from "./DataDictionaries/variables";
import { WorkerProvider, workerContext } from "./WorkerContext/WorkerProvider";
import AuthProvider, { authContext } from "./AuthContext/AuthProvider";
import * as actions from "../components/WorkerActions/Actions";

// import AuthProvider, { authContext } from "./AuthContext/AuthProvider";

export const myContext = createContext();
// export const authContext = createContext();

export const AppFHIR = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedObject, setSelectedObject] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(true);
  const [dDView, setDDView] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [focusData, setFocusData] = useState();
  const [propData, setPropData] = useState(location?.state?.propData);
  const [dataDictionary, setDataDictionary] = useState([]);
  const [reference, setReference] = useState({});
  const [modalData, setModalData] = useState({});
  const [titleData, setTitleData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [observationData, setObservationData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [selectedStudy, setSelectedStudy] = useState(undefined);
  const [selectedReference, setSelectedReference] = useState(undefined);
  const authContextVar = useContext(authContext);
  const useAuth = process.env.REACT_APP_USE_AUTH === "true";

  const { worker } = useContext(workerContext);
  const {
    getTable,
    getDetails,
    getGraph,
    getDetailsDD,
    getCodeableConcept,
    getDDTableDetails,
    getDataDictionary,
    getDataDictionaryReferences,
    getVariables,
  } = actions;

  // console.log("AUTH: ", useAuth, process.env);
  const automationURL = useAuth
    ? process.env.REACT_APP_API_ENDPOINT_AUTH
    : process.env.REACT_APP_API_ENDPOINT;

  useEffect(
    () => () => {
      handleSignOut();
      setSelectedStudy(undefined);
      setSelectedReference(undefined);
      localStorage.clear();
    },
    []
  );

  // useEffect(() => {
  //   console.log("AAAAAAAHHHHH", authContextVar?.userInfo);
  // }, [authContextVar?.userInfo]);

  //   const storeAccessToken = (codeResponse) => {
  //     const expiry = codeResponse.expires_in * 1000;
  //     setTimeout(
  //       () => alert("Your session will expire in one minute."),
  //       expiry - 60000
  //     );
  //     setTimeout(handleSignOut, expiry);
  //     worker?.postMessage({
  //       type: "storeToken",
  //       args: codeResponse.access_token,
  //       url: URL,
  //     });
  //   };

  const handleSignOut = () => {
    // console.log("SIGNOUT");
    authContextVar?.setUserInfo(null);
    setFilterText("");
    setSelectedStudy(undefined);
    worker?.postMessage({ type: "clearToken" });
    authContextVar?.setRedirect("/");
    navigate("/login");
  };

  const clearGraph = () => {
    setFocusData(undefined);
  };

  !!worker &&
    (worker.onmessage = (message) => {
      const { type, data } = message?.data ? message.data : {};
      if (type === "loggedIn") {
        authContextVar?.getUserInfo();
      } else if (type === "user") {
        authContextVar?.setUserInfo(data);
        navigate(authContextVar.getRedirect());
        //selectedStudy ? navigate(`/details/${selectedStudy}`) : navigate("/");
      } else if (type === "table") {
        setTableData(data.entry);
      } else if (type === "details") {
        setPropData(data?.entry?.[0]);
      } else if (type === "graph") {
        setFocusData(data);
      } else if (type === "detailsDD") {
        setDataDictionary(data.entry);
      } else if (type === "DDTableDetails") {
        let vars = [];
        data?.data?.forEach((v, index) => {
          let matched = false;
          data?.varSums?.entry?.forEach((vs) => {
            if (
              vs?.resource.valueCodeableConcept.coding?.[0]?.code ===
              v?.code?.coding?.[0]?.code
            ) {
              matched = true;
              vars.push({ ...v, detail: vs });
              // varArray.push({ ...v, detail: vs });
            }
          });
          if (!matched) {
            vars.push(v);
          }
        });
        setReference(vars);
      } else if (type === "codeableConcept") {
        setModalData(data);
      } else if (type === "dataDictionary") {
        setTitleData(data.entry);
      } else if (type === "DDReferences") {
        setReference(data);
      } else if (type === "variables") {
        setObservationData(data[0]);
        setActivityData(data[1]);
      } else if (type === "report") {
        // console.log("REPORT! ", data);
      }
    });

  // console.log("AppFHIR: ", userInfo);

  return (
    <myContext.Provider
      value={{
        selectedObject,
        setSelectedObject,
        selectedStudy,
        setSelectedStudy,
        selectedReference,
        setSelectedReference,
        setFilterText,
        loading,
        setLoading,
        details,
        setDetails,
        dDView,
        setDDView,
        clearGraph,
        URL,
        getTable,
        tableData,
        getDetails,
        propData,
        getGraph,
        focusData,
        getDetailsDD,
        dataDictionary,
        getDDTableDetails,
        reference,
        setReference,
        getCodeableConcept,
        modalData,
        getDataDictionary,
        setFilterText,
        filterText,
        titleData,
        getDataDictionaryReferences,
        searchTerm,
        setSearchTerm,
        getVariables,
        observationData,
        activityData,
        handleSignOut,
      }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <>
              <NavBar />
              <Outlet />
            </>
          }
        >
          <Route path="/login" element={<Login />} />
          <Route index element={<Table />} />
          <Route path="/details/:studyId" element={<DetailsView />} />
          <Route path="/dataDictionary" element={<DataDictionary />} />
          <Route
            path="/dataDictionary/:DDReference"
            element={<DataDictionaryReferences />}
          />
          <Route path="/variables" element={<Variables />} />
          <Route
            path="/variable-summary/:studyId"
            element={<VariableSummary />}
          />
        </Route>
      </Routes>
    </myContext.Provider>
  );
};
