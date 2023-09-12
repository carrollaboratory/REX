import { useContext } from "react";
import { workerContext } from "../WorkerContext/WorkerProvider";
import { useLocation } from "react-router-dom";

export const useAuth = process.env.REACT_APP_USE_AUTH === "true";

export const automationURL = useAuth
  ? process.env.REACT_APP_API_ENDPOINT_AUTH
  : process.env.REACT_APP_API_ENDPOINT;

export const workerPost = (obj, worker) => {
  worker?.postMessage({ ...obj, auth: useAuth });
};

export const getTable = (worker) => {
  workerPost(
    {
      type: "tableRequest",
      url: automationURL,
    },
    worker
  );
};

export const getDetails = (selectedStudy, worker) => {
  workerPost(
    {
      type: "detailsRequest",
      args: selectedStudy,
      url: automationURL,
    },
    worker
  );
};

export const getGraph = (selectedStudy, worker) => {
  workerPost(
    {
      type: "graphRequest",
      args: selectedStudy,
      url: automationURL,
    },
    worker
  );
};

export const getDetailsDD = (propData, worker) => {
  workerPost(
    {
      type: "detailsDDRequest",
      args: propData,
      url: automationURL,
    },
    worker
  );
};

export const getDDTableDetails = (refArray, selectedStudy, worker) => {
  workerPost(
    {
      type: "DDTableDetailsRequest",
      args: { refArray, selectedStudy },
      url: automationURL,
    },
    worker
  );
};

export const getCodeableConcept = (referenceObj, worker) => {
  workerPost(
    {
      type: "codeableConceptRequest",
      args: referenceObj,
      url: automationURL,
    },
    worker
  );
};

export const getDataDictionary = (searchTerm, worker) => {
  workerPost(
    {
      type: "dataDictionaryRequest",
      args: searchTerm,
      url: automationURL,
    },
    worker
  );
};

export const getDataDictionaryReferences = (selectedReference, worker) => {
  workerPost(
    {
      type: "DDReferencesRequest",
      args: selectedReference,
      url: automationURL,
    },
    worker
  );
};

export const getVariables = (searchTerm, worker) => {
  if (searchTerm == null || !searchTerm) {
    workerPost(
      {
        type: "variablesRequest",
        args: "",
        url: automationURL,
      },
      worker
    );
  } else {
    workerPost(
      {
        type: "variablesRequest",
        args: searchTerm,
        url: automationURL,
      },
      worker
    );
  }
};
