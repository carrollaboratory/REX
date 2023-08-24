{
  let accessToken;
  let urlEndpoint;
  let studyId;
  let selectedStudy;

  onmessage = (event) => {
    const { type, args, url, auth } = event.data;

    const authHeaders = {
      headers: {
        "Content-Type": "application/fhir+json; fhirVersion=4.0",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const checkFetch = (url, obj) => {
      postMessage({
        type: "report",
        data: { url, ...(auth ? { ...obj, ...authHeaders } : obj) },
      });
      return fetch(url, auth ? { ...obj, ...authHeaders } : obj);
    };
    if (type === "storeToken") {
      accessToken = args;
      urlEndpoint = url;
      postMessage({ type: "loggedIn", data: accessToken });
    }
    // else if (type === "report") {
    //   postMessage({ type: "report", data: accessToken });
    // }
    else if (type === "userRequest") {
      checkFetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => postMessage({ type: "user", data }));
    } else if (type === "clearToken") {
      accessToken = undefined;
      urlEndpoint = undefined;
      studyId = undefined;
      selectedStudy = undefined;
    } else if (type === "tableRequest") {
      urlEndpoint = url;
      console.log("URL", urlEndpoint);
      // console.log("PROCESS.ENV", process.env);
      // process.env.REACT_APP_USE_AUTH === "true"
      //   ? checkFetch(urlEndpoint + "/ResearchStudy?_count=500", {
      //       method: "GET",
      //       headers: {
      //         "Content-Type": "application/fhir+json; fhirVersion=4.0",
      //         Authorization: `Bearer ${accessToken}`,
      //       },
      //     })
      //       .then((res) => res.json())
      //       .then((data) => postMessage({ type: "table", data }))
      //   :
      checkFetch(urlEndpoint + "/ResearchStudy?_count=500", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => postMessage({ type: "table", data }));
    } else if (type === "detailsRequest") {
      studyId = args;
      checkFetch(
        urlEndpoint + "/ResearchStudy?_id=" + studyId
        // , {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/fhir+json; fhirVersion=4.0",
        //     // Authorization: `Bearer ${accessToken}`,
        //   },
        // }
      )
        .then((res) => res.json())
        .then((data) => postMessage({ type: "details", data }));
    } else if (type === "graphRequest") {
      if (!studyId) {
        studyId = args;
      }
      checkFetch(
        urlEndpoint + "/Observation?focus=ResearchStudy/" + studyId
        // , {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/fhir+json; fhirVersion=4.0",
        //     // Authorization: `Bearer ${accessToken}`,
        //   },
        // }
      )
        .then((res) => res.json())
        .then((data) => postMessage({ type: "graph", data }));
    } else if (type === "detailsDDRequest") {
      propData = args;
      const valueSplit = propData?.resource.identifier?.[0]?.value.split("_");

      const secondValue =
        propData?.resource.identifier?.[0]?.value.split("_")[1];

      const firstValue =
        propData?.resource.identifier?.[0]?.value.split("_")[0];

      const lowerCasedO =
        firstValue.slice(0, 4) +
        firstValue.charAt(4).toLowerCase() +
        firstValue.slice(5);

      // valueSplit > 2
      // ? checkFetch(
      //     urlEndpoint + "/ActivityDefinition?_tag=" + secondValue + "_DD",
      //     {
      //       method: "GET",
      //       headers: {
      //         "Content-Type": "application/fhir+json; fhirVersion=4.0",
      //         Authorization: `Bearer ${accessToken}`,
      //       },
      //     }
      //   )
      // :
      auth
        ? checkFetch(
            urlEndpoint + "/ActivityDefinition?_tag=" + lowerCasedO + "_DD",
            {
              method: "GET",
              // headers: {
              //   "Content-Type": "application/fhir+json; fhirVersion=4.0",
              //   // Authorization: `Bearer ${accessToken}`,
              // },
            }
          )
            .then((res) => res.json())
            .then((data) => postMessage({ type: "detailsDD", data }))
        : checkFetch(
            urlEndpoint + "/ActivityDefinition?_tag=" + secondValue + "_DD",
            {
              method: "GET",
            }
          )
            .then((res) => res.json())
            .then((data) => postMessage({ type: "detailsDD", data }));
    } else if (type === "DDTableDetailsRequest") {
      let table;
      if (!studyId) {
        studyId = args.studyId;
      }
      const { refArray } = args;
      let arr = [];
      let d;
      Promise.all(
        refArray?.map((c) =>
          checkFetch(urlEndpoint + "/" + c.reference, {
            method: "GET",
            // headers: {
            //   "Content-Type": "application/fhir+json; fhirVersion=4.0",
            //   // Authorization: `Bearer ${accessToken}`,
            // },
          })
        )
      )
        .then((responses) =>
          Promise.all(responses?.map((response) => response.json()))
        )
        .then((data) => {
          d = data;
          checkFetch(
            urlEndpoint +
              "/Observation?value-concept=" +
              data?.[0]?.code?.coding?.[0]?.system +
              "|&focus=ResearchStudy/" +
              studyId,
            {
              method: "GET",
              // headers: {
              //   "Content-Type": "application/fhir+json; fhirVersion=4.0",
              //   // Authorization: `Bearer ${accessToken}`,
              // },
            }
          )
            .then((res) => res.json())
            .then((varSums) => {
              arr = varSums;
            })
            .then(() =>
              postMessage({
                type: "DDTableDetails",
                data: { data: d, varSums: arr },
              })
            );
        })

        // .then(async (data) => {
        //   await Promise.all(
        //     data.map((d) =>
        //       checkFetch(
        //         urlEndpoint +
        //           "/Observation?value-concept=" +
        //           d?.code?.coding?.[0]?.system +
        //   "|" +
        //   d?.code?.coding?.[0]?.code +
        //   "&focus=ResearchStudy/" +
        //   studyId,
        // {
        //           method: "GET",
        //           headers: {
        //             "Content-Type": "application/fhir+json; fhirVersion=4.0",
        //             Authorization: `Bearer ${accessToken}`,
        //           },
        //         }
        //       )
        //         .then((response) => response.json())
        //         .then((detail) => arr.push({ ...d, detail }))
        //     )
        //   );
        //   return data;
        // })
        .then((data) => postMessage({ type: "DDTableDetails", data: arr }));
    } else if (type === "codeableConceptRequest") {
      checkFetch(urlEndpoint + "/" + args, {
        method: "GET",
        headers: {
          "Content-Type": "application/fhir+json; fhirVersion=4.0",
          // Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((d) =>
          checkFetch(
            urlEndpoint + "/CodeSystem?url=" + d?.compose?.include[0]?.system,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/fhir+json; fhirVersion=4.0",
                // Authorization: `Bearer ${accessToken}`,
              },
            }
          )
        )
        .then((res) => res.json())
        .then((data) => postMessage({ type: "codeableConcept", data }));
    } else if (type === "dataDictionaryRequest") {
      args != ""
        ? checkFetch(
            urlEndpoint +
              "/ObservationDefinition?code:text=" +
              args +
              "&_revinclude=ActivityDefinition:result",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/fhir+json; fhirVersion=4.0",
                // Authorization: `Bearer ${accessToken}`,
              },
            }
          )
            .then((res) => res.json())
            .then((data) => postMessage({ type: "dataDictionary", data }))
        : checkFetch(urlEndpoint + "/ActivityDefinition", {
            method: "GET",
            headers: {
              "Content-Type": "application/fhir+json; fhirVersion=4.0",
              // Authorization: `Bearer ${accessToken}`,
            },
          })
            .then((res) => res.json())
            .then((data) => postMessage({ type: "dataDictionary", data }));
    } else if (type === "DDReferencesRequest") {
      Promise.all(
        args?.observationResultRequirement?.map((c) =>
          checkFetch(urlEndpoint + "/" + c.reference, {
            method: "GET",
            headers: {
              "Content-Type": "application/fhir+json; fhirVersion=4.0",
              // Authorization: `Bearer ${accessToken}`,
            },
          })
        )
      )
        .then((responses) =>
          Promise.all(responses.map((response) => response.json()))
        )
        .then((data) => postMessage({ type: "DDReferences", data }));
    } else if (type === "variablesRequest") {
      let observationArray = [];
      let activityArray = [];
      args != ""
        ? checkFetch(
            urlEndpoint +
              "/ObservationDefinition?code:text=" +
              args +
              "&_revinclude=ActivityDefinition:result",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/fhir+json; fhirVersion=4.0",
                // Authorization: `Bearer ${accessToken}`,
              },
            }
          )
            .then((res) => res.json())
            .then((c) => {
              c.entry?.forEach((r) => {
                if (r?.resource?.resourceType === "ObservationDefinition") {
                  observationArray.push(r);
                } else {
                  activityArray.push(r);
                }
              });
            })
            .then(() =>
              postMessage({
                type: "variables",
                data: [observationArray, activityArray],
              })
            )
        : checkFetch(
            urlEndpoint +
              "/ActivityDefinition?_include=ActivityDefinition:result",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/fhir+json; fhirVersion=4.0",
                // Authorization: `Bearer ${accessToken}`,
              },
            }
          )
            .then((res) => {
              return res.json();
            })
            .then((c) => {
              c.entry.forEach((r) => {
                if (r?.resource?.resourceType === "ObservationDefinition") {
                  observationArray.push(r);
                } else {
                  activityArray.push(r);
                }
              });
            })
            .then(() =>
              postMessage({
                type: "variables",
                data: [observationArray, activityArray],
              })
            );
    }
  };
}
