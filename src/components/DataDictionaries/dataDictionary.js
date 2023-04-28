import { useContext, useEffect, useState } from "react";
import "./dataDictionary.css";
import DataTable from "react-data-table-component";
import { myContext } from "../../App";
import { Link } from "react-router-dom";

function DataDictionary() {
  const [titleData, setTitleData] = useState([]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { filterText, setFilterText } = useContext(myContext);
  const [searchResults, setSearchResults] = useState([]);

  // const getFilteredItems = () => {
  //   titleData.map((r) => r?.resource?.title);
  // };
  useEffect(() => {
    getSearchResults();
  }, []);

  const getSearchResults = () => {
    console.log("text: ", filterText);
    let dataArray = [];
    let finalArray = [];
    filterText != ""
      ? fetch(
          `https://anvil-fhir-vumc.uc.r.appspot.com/fhir/ObservationDefinition?code:text=${filterText}&_revinclude=ActivityDefinition:result`,
          {
            method: "GET",
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((c) => {
            setTitleData(c.entry);
          })
      : fetch(
          "https://anvil-fhir-vumc.uc.r.appspot.com/fhir/ActivityDefinition",
          {
            method: "GET",
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((c) => {
            setTitleData(c.entry);
          });
  };

  // console.log("FILTER: " + filterText);
  const tableCustomStyles = {
    headRow: {
      style: {
        backgroundColor: "#E7EEF0",
      },
    },
    rows: {
      style: {
        backgroundColor: "#E7EEF0",
      },
      stripedStyle: {
        color: "#000000",
        backgroundColor: "#FFFFFF",
      },
    },
  };

  const columns = [
    {
      name: "Data Dictionary",
      selector: (row) => (
        <Link
          state={{
            selectedDictionaryReferences: row?.resource,
          }}
          to={`/dataDictionary/${row?.resource?.id}`}
        >
          {row?.resource?.title ? row?.resource?.title : ""}
        </Link>
      ),
      wrap: true,
    },
  ];

  // const fetchTableData = () => {
  //   setLoading(true);
  //   fetch("https://anvil-fhir-vumc.uc.r.appspot.com/fhir/ActivityDefinition", {
  //     method: "GET",
  //   })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((c) => {
  //       setTitleData(c.entry);
  //     });
  //   setLoading(false);
  // };

  return (
    <div className="table-wrapper">
      <div className="table">
        <div className="table-title">
          <h4>Data Dictionaries</h4>
        </div>
        <div className="search-input-dd">
          <input
            type="text"
            placeholder="Search by value..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <button onClick={(e) => getSearchResults()}>Search</button>
        </div>
        <DataTable
          columns={columns}
          data={titleData}
          progressPending={loading}
          fixedHeader
          striped={true}
          customStyles={tableCustomStyles}
        />
      </div>
    </div>
  );
}

export default DataDictionary;
