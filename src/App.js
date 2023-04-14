import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { createContext, useState } from "react";
import DetailsView from "./components/tables/details";
import Table from "./components/tables/table";
import { NavBar } from "./components/nav/navBar";

export const myContext = createContext();
export const App = () => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [filterText, setFilterText] = useState("");

  return (
    <myContext.Provider
      value={{ selectedObject, setSelectedObject, filterText, setFilterText }}
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
          {/* <Route path="details/:studyId" element={<></>} /> */}
        </Route>
      </Routes>
    </myContext.Provider>
  );
};
