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
import { Variables } from "./components/DataDictionaries/variables";

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
  const [modalData, setModalData] = useState({});
  const [titleData, setTitleData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [observationData, setObservationData] = useState([]);
  const [activityData, setActivityData] = useState([]);

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
      args: accessToken,
      url: URL,
    });
    // worker?.postMessage({ type: "report" });
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
    worker?.postMessage({ type: "detailsRequest", args: studyId });
  };

  const getGraph = (studyId) => {
    worker?.postMessage({ type: "graphRequest", args: studyId });
  };

  const getDetailsDD = () => {
    worker?.postMessage({ type: "detailsDDRequest", args: propData });
  };

  const getDDTableDetails = (refArray, studyParam) => {
    worker?.postMessage({
      type: "DDTableDetailsRequest",
      args: { refArray, studyId },
    });
  };

  const getCodeableConcept = (referenceObj) => {
    worker?.postMessage({
      type: "codeableConceptRequest",
      args: referenceObj,
    });
  };

  const getDataDictionary = () => {
    worker?.postMessage({
      type: "dataDictionaryRequest",
      args: searchTerm,
    });
  };

  const getDataDictionaryReferences = (selectedDictionaryReferences) => {
    worker?.postMessage({
      type: "DDReferencesRequest",
      args: selectedDictionaryReferences,
    });
  };

  const getVariables = (search = null) => {
    if (search == null) {
      worker?.postMessage({
        type: "variablesRequest",
        args: searchTerm,
      });
    } else {
      setSearchTerm("");
      worker?.postMessage({
        type: "variablesRequest",
        args: "",
      });
    }
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
        // console.log("data.data", data?.data?.[0]?.code?.coding?.[0]?.code);
        // console.log(
        //   "varSums",
        //   data?.varSums?.entry?.[0]?.resource.valueCodeableConcept.coding?.[0]
        //     ?.code
        // );
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
        console.log("REPORT!!!!! ", data);
      }
    });

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
      }}
    >
      <myContext.Provider
        value={{
          selectedObject,
          setSelectedObject,

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
    </authContext.Provider>
  );
};
