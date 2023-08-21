import React, { useState, createContext } from "react";

export const workerContext = createContext();
export const WorkerProvider = ({ children }) => {
  const [worker, setWorker] = useState(null);
  if (worker == null) {
    setWorker(new Worker("/worker.js"));
  }

  return (
    <workerContext.Provider value={{ worker }}>
      {children}
    </workerContext.Provider>
  );
};
