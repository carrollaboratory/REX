import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { createContext, useState, useEffect } from "react";
import Table from "./components/tables/table";
import { NavBar } from "./components/nav/navBar";
import DetailsView from "./components/tables/details";
import DataDictionary from "./components/DataDictionaries/dataDictionary";
import DataDictionaryReferences from "./components/DataDictionaries/dataDictionaryReferences";
import { VariableSummary } from "./components/VariableSummaries/variableSummary";
import { Home } from "./components/home";
import { Login } from "./components/Auth/Login";

export const myContext = createContext();
export const authContext = createContext();

export const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedObject, setSelectedObject] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(true);
  const [dDView, setDDView] = useState(true);
  const [worker, setWorker] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [focusData, setFocusData] = useState();
  const [propData, setPropData] = useState(location?.state?.propData);
  const [dataDictionary, setDataDictionary] = useState([]);
  const [reference, setReference] = useState({});
  const [variableData, setVariableData] = useState({});
  const [redirect, setRedirect] = useState(false);

  const { studyId } = useParams();

  // userInfo !== null && console.log(userInfo);
  const URL = process.env.REACT_APP_API_ENDPOINT;

  useEffect(() => {
    userInfo === null && navigate("/login");
  }, [userInfo]);

  if (worker == null) {
    setWorker(new Worker("./worker.js"));
  }

  const storeAccessToken = (accessToken) => {
    worker?.postMessage({
      type: "storeToken",
      token: accessToken,
      url: URL,
    });
    worker?.postMessage({ type: "report" });
  };
  // console.log("REPORT");
  // worker?.postMessage({ type: "report" });

  const handleSignOut = () => {
    setUserInfo(null);
    worker?.postMessage({ type: "clearToken" });
    navigate("/login");
  };

  const getTable = () => {
    worker?.postMessage({ type: "tableRequest" });
  };

  const getUserInfo = () => {
    worker?.postMessage({ type: "userRequest" });
  };

  const getDetails = (studyId) => {
    worker?.postMessage({ type: "detailsRequest", studyParam: studyId });
  };

  const getGraph = (studyId) => {
    worker?.postMessage({ type: "graphRequest", studyParam: studyId });
  };

  const getDetailsDD = () => {
    worker?.postMessage({ type: "detailsDDRequest", passedProp: propData });
  };

  const getDDTableDetails = (refArray) => {
    worker?.postMessage({
      type: "DDTableDetailsRequest",
      selectedDictionaryReferences: refArray,
    });
  };

  const getVariableSummary = (obsProp) => {
    worker?.postMessage({
      type: "variableSummaryRequest",
      obsDefinition: obsProp,
      studyParam: studyId,
    });
  };

  worker !== null &&
    (worker.onmessage = (message) => {
      const { type, data } = message?.data ? message.data : {};
      if (type === "loggedIn") {
        getUserInfo();
        navigate("/");
      } else if (type === "user") {
        setUserInfo(data);
      } else if (type === "table") {
        setTableData(data.entry);
      } else if (type === "details") {
        setPropData(data?.entry?.[0]);
        setRedirect(true);
      } else if (type === "graph") {
        setFocusData(data);
      } else if (type === "detailsDD") {
        setDataDictionary(data.entry);
      } else if (type === "DDTableDetails") {
        setReference(data);
      } else if (type === "variableSummary") {
        setVariableData(data.entry);
      } else if (type === "report") {
        // console.log("TOKEN!!!!! ", data);
      }
    });

  useEffect(() => {
    location.pathname === "/variables" && setDDView(false);
  }, [location]);

  return (
    <authContext.Provider
      value={{
        storeAccessToken,
        getTable,
        getUserInfo,
        userInfo,
        handleSignOut,
        getTable,
        tableData,
        getDetails,
        propData,
        setRedirect,
        redirect,
        getGraph,
        focusData,
        getDetailsDD,
        dataDictionary,
        getDDTableDetails,
        reference,
        getVariableSummary,
        variableData,
      }}
    >
      <myContext.Provider
        value={{
          selectedObject,
          setSelectedObject,
          filterText,
          setFilterText,
          loading,
          setLoading,
          details,
          setDetails,
          dDView,
          setDDView,
          URL,
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
            {/* 
            <Route path="/dataDictionary" element={<DataDictionary />} />
            <Route
              path="/dataDictionary/:DDReference"
              element={<DataDictionaryReferences />}
              s
            />
            <Route path="/variables" element={<DataDictionary />} />*/}
            <Route
              path="/variable-summary/:studyId"
              element={<VariableSummary />}
            />
          </Route>
        </Routes>
      </myContext.Provider>
    </authContext.Provider>
  );
};
