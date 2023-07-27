import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../App";

export const SearchBar = ({ children }) => {
  const { searchTerm, setSearchTerm, getVariables } = useContext(authContext);
  const navigate = useNavigate();
  useEffect(() => {
    getVariables("");
  }, []);

  return (
    <div className="dd-table-wrapper">
      <div className="table">
        <div className="dd-title">
          <h3
            className="dd-nav-header"
            onClick={() => {
              navigate("/dataDictionary");
            }}
          >
            Data Dictionaries
          </h3>
          <h3
            className="dd-nav-header"
            onClick={() => {
              navigate("/variables");
            }}
          >
            Variables
          </h3>
        </div>
        <div className="search-input-dd">
          <input
            id="inputText"
            type="text"
            placeholder="Search by value..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />

          <button className="search-button" onClick={(e) => getVariables()}>
            Search
          </button>
          <button
            className="clear-button"
            onClick={() => {
              setSearchTerm("");
              getVariables("");
            }}
          >
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
