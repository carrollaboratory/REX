import "./loadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div
      className="spinner-container"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
