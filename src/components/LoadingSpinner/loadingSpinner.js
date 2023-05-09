import "./loadingSpinner.css";

const LoadingSpinner = (props) => {
  return (
    <div
      {...props}
      className="spinner-container"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
