import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { myContext } from "../AppFHIR";
import { workerContext } from "../WorkerContext/WorkerProvider";

export const SearchBar = ({ children }) => {
  const { getVariables } = useContext(myContext);
  const { worker } = useContext(workerContext);
  const [searchTerm, setSearchTerm] = useState("");
  const searchBar = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    getVariables(searchTerm, worker);
  }, [searchTerm]);

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
            ref={searchBar}
            placeholder="Search by value..."
          />

          <button
            className="search-button"
            onClick={() => setSearchTerm(searchBar.current.defaultValue)}
          >
            Search
          </button>
          <button
            className="clear-button"
            onClick={() => {
              setSearchTerm("");
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
