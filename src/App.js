import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { createContext, useState } from "react";
import Table from "./components/tables/table";
import { NavBar } from "./components/nav/navBar";
import DetailsView from "./components/tables/details";

export const myContext = createContext();
export const App = () => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(true);

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
          <Route index element={<Table />}></Route>
          <Route path="/details/:studyId" element={<DetailsView />} />
        </Route>
      </Routes>
    </myContext.Provider>
  );
};
