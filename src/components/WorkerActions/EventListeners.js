/* eslint-disable */

import * as auth from "../AuthContext/AuthActions";

export const eventListeners = (message) => {
  const { type, data } = message?.data ? message.data : {};
  if (type === "loggedIn") {
    auth.getUserInfo();
  } else if (type === "user") {
    // setUserInfo(data);
    //selectedStudy ? navigate(`/details/${selectedStudy}`) : navigate("/");
  }
  //   else if (type === "table") {
  //     my.setTableData(data.entry);
  //   } else if (type === "details") {
  //     my.setPropData(data?.entry?.[0]);
  //   } else if (type === "graph") {
  //     my.setFocusData(data);
  //   } else if (type === "detailsDD") {
  //     my.setDataDictionary(data.entry);
  //   } else if (type === "DDTableDetails") {
  //     let vars = [];
  //     data?.data?.forEach((v, index) => {
  //       let matched = false;
  //       data?.varSums?.entry?.forEach((vs) => {
  //         if (
  //           vs?.resource.valueCodeableConcept.coding?.[0]?.code ===
  //           v?.code?.coding?.[0]?.code
  //         ) {
  //           matched = true;
  //           vars.push({ ...v, detail: vs });
  //           // varArray.push({ ...v, detail: vs });
  //         }
  //       });
  //       if (!matched) {
  //         vars.push(v);
  //       }
  //     });
  //     my.setReference(vars);
  //   } else if (type === "codeableConcept") {
  //     my.setModalData(data);
  //   } else if (type === "dataDictionary") {
  //     my.setTitleData(data.entry);
  //   } else if (type === "DDReferences") {
  //     my.setReference(data);
  //   } else if (type === "variables") {
  //     my.setObservationData(data[0]);
  //     my.setActivityData(data[1]);
  //   }
  // else if (type === "report") {
  //   console.log("REPORT! ", data);
  // }
};
