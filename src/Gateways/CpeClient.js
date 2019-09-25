import React from 'react';
export const CpeClient = {getCvesForCpes,getAutoCompleteItems,
        getExampleCpes, getStats};
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
export function getCvesForCpes(cpes, itemsPerPage, numPage, success) {
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
      "fields": fields
    })
  }).then(checkStatus)
    .then(parseJSON)
    .then(success);
}


export function getCveSummaryForCpe(cpe) {
  console.log(CVESERVICE_URL+'/api/v1/cves/summary/vulnerable_configuration/' 
        + cpe;
  fetch(CVESERVICE_URL + '/api/v1/cves/summary/vulnerable_configuration/' 
        + cpe, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
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

export function getExampleCpes() {
  return [{
    "id": "cpe:2.3:o:microsoft:windows_xp:-:-:-",
    cpe_2_2: "cpe:/o:microsoft:windows_xp:-:-:-",
    "title": "Microsoft Windows XP Service Pack 2",
    isActive: true,
  },
  {
    id: "cpe:2.3:o:avm:fritz:-:-:-",
    cpe_2_2: "cpe:/o:avm:fritz:-:-:-",
  },];
  
}

