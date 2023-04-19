import "./dataDictionary.css";

export const DataDictionary = () => {
  return (
    <>
      <div className="data-dictionary-container">
        <div className="dd-title">
          <h4>Data Dictionaries</h4>
        </div>
        <div className="search-input-dd">
          <input
            type="text"
            placeholder="Search..."
            // value={filterText}
            // onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};
