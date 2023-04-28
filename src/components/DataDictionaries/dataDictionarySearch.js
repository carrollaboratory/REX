import { useContext, useEffect, useState } from "react";
import "./dataDictionary.css";
import DataTable from "react-data-table-component";
import { myContext } from "../../App";
import { Link } from "react-router-dom";

function DataDictionarySearch() {
  //   const [titleData, setTitleData] = useState([]);
  //   const [data, setData] = useState({});
  //   const [loading, setLoading] = useState(false);
  //   const [searchTerm, setSearchTerm] = useState("");
  //   const { filterText, setFilterText } = useContext(myContext);
  //   const [searchResults, setSearchResults] = useState([]);

  //   // const getFilteredItems = () => {
  //   //   titleData.map((r) => r?.resource?.title);
  //   // };
  //   useEffect(() => {
  //     getSearchResults();
  //   }, []);

  //   const getSearchResults = () => {
  //     fetch(
  //       `https://anvil-fhir-vumc.uc.r.appspot.com/fhir/ObservationDefinition?code:text=${filterText}`,
  //       {
  //         method: "GET",
  //       }
  //     )
  //       .then((res) => {
  //         return res.json();
  //       })
  //       .then((c) => {
  //         Promise.all(
  //           c.entry.map((r) =>
  //             fetch(
  //               `https://anvil-fhir-vumc.uc.r.appspot.com/fhir/ActivityDefinition?result=ObservationDefinition/${r.resource.id}`
  //             )
  //           )
  //         )
  //           .then((responses) =>
  //             Promise.all(responses.map((response) => response.json()))
  //           )
  //           .then((res) => {
  //             res.map((r) => dataArray.push(r));
  //             dataArray.map((c) => finalArray.push(c.entry));
  //             // console.log("ARRAY: " + JSON.stringify(finalArray));
  //           });

  //         setTitleData(finalArray);
  //         console.log("TITLE DATA: " + JSON.stringify(titleData));

  //         // setTitleData(r?.[0]?.entry);
  //       });
  //   };

  //   // console.log("FILTER: " + filterText);
  //   const tableCustomStyles = {
  //     headRow: {
  //       style: {
  //         backgroundColor: "#E7EEF0",
  //       },
  //     },
  //     rows: {
  //       style: {
  //         backgroundColor: "#E7EEF0",
  //       },
  //       stripedStyle: {
  //         color: "#000000",
  //         backgroundColor: "#FFFFFF",
  //       },
  //     },
  //   };

  return (
    <div>Hello world</div>
    // <div className="table-wrapper">
    //   <div className="table">
    //     <div className="table-title">
    //       <h4>Data Dictionaries</h4>
    //     </div>
    //     <div className="search-input-dd">
    //       <input
    //         type="text"
    //         placeholder="Search by value..."
    //         value={filterText}
    //         onChange={(e) => setFilterText(e.target.value)}
    //       />
    //       <button onClick={(e) => getSearchResults()}>Search</button>
    //     </div>
    //     <DataTable
    //       columns={columns}
    //       data={titleData}
    //       progressPending={loading}
    //       fixedHeader
    //       striped={true}
    //       customStyles={tableCustomStyles}
    //     />
    //   </div>
    // </div>
  );
}

export default DataDictionarySearch;
