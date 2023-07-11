{
  let accessToken;
  let urlEndpoint;
  let studyId;

  onmessage = (event) => {
    const { type, args, studyParam, url } = event.data;

    if (type === "storeToken") {
      accessToken = args;
      urlEndpoint = url;
      postMessage({ type: "loggedIn", data: accessToken });
    } else if (type === "report") {
      postMessage({ type: "report", data: accessToken });
    } else if (type === "userRequest") {
      fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
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
    } else if (type === "tableRequest") {
      fetch(urlEndpoint + "/ResearchStudy?_count=500", {
        method: "GET",
        headers: {
          "Content-Type": "application/fhir+json; fhirVersion=4.0",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => postMessage({ type: "table", data }));
    } else if (type === "detailsRequest") {
      studyId = args;
      fetch(urlEndpoint + "/ResearchStudy?_id=" + studyId, {
        method: "GET",
        headers: {
          "Content-Type": "application/fhir+json; fhirVersion=4.0",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => postMessage({ type: "details", data }));
    } else if (type === "graphRequest") {
      if (!studyId) {
        studyId = args;
      }
      fetch(urlEndpoint + "/Observation?focus=ResearchStudy/" + studyId, {
        method: "GET",
        headers: {
          "Content-Type": "application/fhir+json; fhirVersion=4.0",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => postMessage({ type: "graph", data }));
    } else if (type === "detailsDDRequest") {
      propData = args;
      const valueSplit =
        propData?.resource.identifier?.[0]?.value.split("_").length;

      const secondValue =
        propData?.resource.identifier?.[0]?.value.split("_")[1];

      const firstValue =
        propData?.resource.identifier?.[0]?.value.split("_")[0];

      (valueSplit > 2
        ? fetch(
            urlEndpoint + "/ActivityDefinition?_tag=" + secondValue + "_DD",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/fhir+json; fhirVersion=4.0",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
        : fetch(
            urlEndpoint + "/ActivityDefinition?_tag=" + firstValue + "_DD",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/fhir+json; fhirVersion=4.0",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
      )
        .then((res) => res.json())
        .then((data) => postMessage({ type: "detailsDD", data }));
    } else if (type === "DDTableDetailsRequest") {
      if (!studyId) {
        studyId = args.studyId;
      }
      const { refArray } = args;
      let arr = [];
      Promise.all(
        refArray?.map((c) =>
          fetch(urlEndpoint + "/" + c.reference, {
            method: "GET",
            headers: {
              "Content-Type": "application/fhir+json; fhirVersion=4.0",
              Authorization: `Bearer ${accessToken}`,
            },
          })
        )
      )
        .then((responses) =>
          Promise.all(responses?.map((response) => response.json()))
        )
        .then(async (data) => {
          await Promise.all(
            data.map((d) =>
              fetch(
                urlEndpoint +
                  "/Observation?value-concept=" +
                  d?.code?.coding?.[0]?.system +
                  "|" +
                  d?.code?.coding?.[0]?.code +
                  "&focus=ResearchStudy/" +
                  studyId,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/fhir+json; fhirVersion=4.0",
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              )
                .then((response) => response.json())
                .then((detail) => arr.push({ ...d, detail }))
            )
          );
          return data;
        })
        .then((data) => postMessage({ type: "DDTableDetails", data: arr }));
    } else if (type === "codeableConceptRequest") {
      fetch(urlEndpoint + "/" + args, {
        method: "GET",
        headers: {
          "Content-Type": "application/fhir+json; fhirVersion=4.0",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((d) =>
          fetch(
            urlEndpoint + "/CodeSystem?url=" + d?.compose?.include[0]?.system,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/fhir+json; fhirVersion=4.0",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
        )
        .then((res) => res.json())
        .then((data) => postMessage({ type: "codeableConcept", data }));
    } else if (type === "dataDictionaryRequest") {
      args != ""
        ? fetch(
            urlEndpoint +
              "/ObservationDefinition?code:text=" +
              args +
              "&_revinclude=ActivityDefinition:result",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/fhir+json; fhirVersion=4.0",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
            .then((res) => res.json())
            .then((data) => postMessage({ type: "dataDictionary", data }))
        : fetch(urlEndpoint + "/ActivityDefinition", {
            method: "GET",
            headers: {
              "Content-Type": "application/fhir+json; fhirVersion=4.0",
              Authorization: `Bearer ${accessToken}`,
            },
          })
            .then((res) => res.json())
            .then((data) => postMessage({ type: "dataDictionary", data }));
    } else if (type === "DDReferencesRequest") {
      Promise.all(
        args?.observationResultRequirement.map((c) =>
          fetch(urlEndpoint + "/" + c.reference, {
            method: "GET",
            headers: {
              "Content-Type": "application/fhir+json; fhirVersion=4.0",
              Authorization: `Bearer ${accessToken}`,
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
        ? fetch(
            urlEndpoint +
              "/ObservationDefinition?code:text=" +
              args +
              "&_revinclude=ActivityDefinition:result",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/fhir+json; fhirVersion=4.0",
                Authorization: `Bearer ${accessToken}`,
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
        : fetch(
            urlEndpoint +
              "/ActivityDefinition?_include=ActivityDefinition:result",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/fhir+json; fhirVersion=4.0",
                Authorization: `Bearer ${accessToken}`,
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
