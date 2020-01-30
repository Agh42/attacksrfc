import React from 'react';
export const CpeClient = {getCvesForCpes,getAutoCompleteItems,
        getExampleCpes, getStats, healthCheck, getCveSummaryForCpe, getCveById, getCvesByCpesForGraph};
export default CpeClient;

// edit .env/.env.local to change this value:
const CVESERVICE_URL = process.env.REACT_APP_CVESERVICE_URL;

const cves = [];


function getVendor(cpe) {
  return cpe.id.split(':')[3];
}

function getProduct(cpe) {
  return cpe.id.split(':')[4];
}

function replaceSpecialChars(cpe) {
  return cpe.replace(/\//g, "^^").replace(/:/g, "%3A");
}

//########


/**
* Searches CPE titles. Returns array of matching CPEs: {id, title}
*
* @param {any} toComplete the string to search for
* @param {any} success function to call with sucessfull result
*/
function getAutoCompleteItems(toComplete, success) {
   console.log(CVESERVICE_URL+'/api/v1/cpes/prefix/'+toComplete);
   return fetch(CVESERVICE_URL+'/api/v1/cpes/prefix/'+toComplete, {
     headers: {
       Accept: 'application/json',
     },
   }).then(checkStatus)
     .then(parseJSON)
     .then(success);
 }

function checkStatus(response) {
   if (response.status >= 200 && response.status < 300) {
     return response;
   } else {
     const error = new Error(`HTTP Error: ${response.statusText}`);
     error.status = response.statusText;
     error.response = response;
     console.log(error);
     throw error;
   }
 }

 function parseJSON(response) {
   return response.json();
 }

 /**
  * Flatten json result to "{HIGH:1, MEDIUM: 2,...}"
  * from the format returned by the service:
      [
        {
          "_id": {
            "severity": "LOW"
          },
          "count": 151
        },
        {
          "_id": {
            "severity": "CRITICAL"
          },
          "count": 262
        },
        ...
      ]

  * @param {*} json 
  */
 function convertSummary(json) {
    // flatten to [{HIGH:1}, {MEDIUM:2}, ...]
    let flattened = json.map( (elmt) => {
      return {
        [elmt._id.severity] : elmt.count, 
      };
    }); 
    // merge to new {HIGH:1, MEDIUM: 2} object with spread operator:
    if (flattened.length)
      return Object.assign(...flattened);
    else
      return {};
 }


/**
 * Search CVEs for a collection of CPEs.
 * Return only one specific page number from the result.
 *
 * @export
 * @param {*} cpe
 * @param {*} itemsPerPage
 * @param {*} numPage
 * @param {*} success
 * @returns
 */
export function getCvesForCpes(cpes, itemsPerPage, numPage, start, end, success) {
  let fields = ["id", "cvss", "references", "Modified", "Published", "summary"];

  fetch(CVESERVICE_URL + '/api/v1/cves/search', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "vulnerableCpes": cpes,
      "itemsPerPage": itemsPerPage,
      "requestedPage": numPage,
      "fields": fields,
      "published": {
        "from": start.toISOString(),
        "until": end.toISOString()
      }
    })
  }).then(checkStatus)
    .then(parseJSON)
    .then(success);
}

/**
 * Returns count of CVEs grouped by severity for the given CPE:
 * { "LOW" : 42, "MEDIUM" : 23 }
 * 
 * @param {*} cpe 
 * @param {*} success 
 * @param {*} start start for date range
 * @param {*} end end for date range
 */
export function getCveSummaryForCpe(cpe, start, end, success) {
  cpe = replaceSpecialChars(cpe);
  console.log(CVESERVICE_URL+'/api/v1/cves/summary/vulnerable_product/'
        + cpe);
  fetch(CVESERVICE_URL + '/api/v1/cves/summary/vulnerable_product/'
        + cpe + "?publishedFrom=" + start.toISOString() + "&publishedUntil=" + end.toISOString(), {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }).then(checkStatus)
    .then(parseJSON)
    .then(convertSummary)
    .then(success);
}

/**
 * 
 * @param {Object[]} cpes 
 * @callback {CpeClient~getCvesByCpesForGraph} success The function to call with positive result.
 */
export function getCvesByCpesForGraph(cpes, start, end, success) {
  const fields = ["id","cvss","vulnerable_product","vulnerable_configuration"];

  fetch(CVESERVICE_URL + '/api/v1/cves/search', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "vulnerableCpes": cpes,
      "itemsPerPage": 100,
      "requestedPage": 1,
      "fields": fields,
      "published": {
        "from": start.toISOString(),
        "until": end.toISOString()
      }
    })
  }).then(checkStatus)
    .then(parseJSON)
    .then(success);

}

export function getStats(success) {
  return fetch(CVESERVICE_URL+'/api/v1/stats', {
        headers: {
          Accept: 'application/json',
        },
    }).then(checkStatus)
      .then(parseJSON)
      .then(success);
}

export function healthCheck(success, failed) {
  return fetch(CVESERVICE_URL+'/api/v1/stats', {
    headers: {
      Accept: 'application/json',
    },
  }).then(checkStatus)
    .catch(failed)
    .then(success);
}

/**
 * Get all details for a single CVE.
 * 
 * @param {*} id 
 * @param {*} success 
 */
export function getCveById(id, success) {
  //let fields = ["id", "cvss", "references", "Modified", "Published", "summary",
  //  "vulnerable_product", "vulnerable_configuration", "cwe", "access", "impact"];
  
  return fetch(CVESERVICE_URL+'/api/v1/cve/' + id, {
        headers: {
          Accept: 'application/json',
        },
  }).then(checkStatus)
     .then(parseJSON)
     .then(success);

}

export function getExampleCpes() {
  return [{
    "id": "cpe:2.3:o:microsoft:windows_10:-:-:-:-:-:-:-:-",
    cpe_2_2: "cpe:2.3:o:microsoft:windows_10:-:-:-:-:-:-:-:-",
    "title": "Microsoft Windows 10",
    isActive: true,
  },
  {
    id: "cpe:2.3:o:apple:mac_os:-:-:-:-:-:-:-:-",
    cpe_2_2: "cpe:2.3:o:apple:mac_os:-:-:-:-:-:-:-:-",
  },
  {
    id: "cpe:2.3:o:linux:linux_kernel:-:-:-:-:-:-:-:-",
    cpe_2_2: "cpe:2.3:o:linux:linux_kernel:-:-:-:-:-:-:-:-",
  },
  {
    id:"cpe:2.3:o:apple:iphone_os:-:-:-:-:-:-:-:-",
    cpe_2_2: "cpe:2.3:o:apple:iphone_os:-:-:-:-:-:-:-:-",
  },
  {
    id:"cpe:2.3:o:google:android:-:-:-:-:-:-:-:-",
    cpe_2_2: "cpe:2.3:o:google:android:-:-:-:-:-:-:-:-",
  },
];

}


