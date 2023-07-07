{
  let accessToken;
  let urlEndpoint;
  let studyId;

  onmessage = (event) => {
    const {
      type,
      token,
      url,
      studyParam,
      passedProp,
      selectedDictionaryReferences,
      obsDefinition,
      codeableConceptReference,
    } = event.data;

    if (type === "storeToken") {
      accessToken = token;
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
      studyId = studyParam;
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
      propData = passedProp;
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
      Promise.all(
        selectedDictionaryReferences?.map((c) =>
          fetch(urlEndpoint + "/" + c.reference, {
            method: "GET",
            headers: {
              "Content-Type": "application/fhir+json; fhirVersion=4.0",
              Authorization: `Bearer ${accessToken}`,
            },
          })
        )
      ).then((responses) =>
        Promise.all(responses?.map((response) => response.json()))
          .then((data) => {
            return data.map((d) => {
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
              );
              return { ...d, detail: "Piggies" };
            });
          })
          .then((data) => postMessage({ type: "DDTableDetails", data }))
      );
    } else if (type === "variableSummaryRequest") {
      fetch(
        urlEndpoint +
          "/Observation?value-concept=" +
          obsDefinition?.code?.coding?.[0]?.system +
          "|" +
          obsDefinition?.code?.coding?.[0]?.code +
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
        .then((res) => res.json())
        .then((data) => postMessage({ type: "variableSummary", data }));
    } else if (type === "codeableConceptRequest") {
      fetch(urlEndpoint + "/" + codeableConceptReference, {
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
    }
  };
}
