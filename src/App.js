import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { createContext, useState, useEffect } from "react";
import Table from "./components/tables/table";
import { NavBar } from "./components/nav/navBar";
import DetailsView from "./components/tables/details";
import DataDictionary from "./components/DataDictionaries/dataDictionary";
import DataDictionaryReferences from "./components/DataDictionaries/dataDictionaryReferences";
import { VariableSummary } from "./components/VariableSummaries/variableSummary";

export const myContext = createContext();
export const App = () => {
  const location = useLocation();

  const [selectedObject, setSelectedObject] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(true);
  const [dDView, setDDView] = useState(true);

  useEffect(() => {
    location.pathname === "/variables" && setDDView(false);
  }, [location]);

  return (
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
          <Route index element={<Table />} />
          <Route path="/details/:studyId" element={<DetailsView />} />
          <Route path="/dataDictionary" element={<DataDictionary />} />
          <Route
            path="/dataDictionary/:DDReference"
            element={<DataDictionaryReferences />}
            s
          />
          <Route path="/variables" element={<DataDictionary />} />
          <Route
            path="/variable-summary/:studyId"
            element={<VariableSummary />}
          />
        </Route>
      </Routes>
    </myContext.Provider>
  );
};
