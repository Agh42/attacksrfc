
export const AccountClient= {getAccount, saveAccount};
export default AccountClient;

const CVESERVICE_URL = process.env.REACT_APP_CVESERVICE_URL;


function getAccount(success, token) {
  console.log("Fetching account information");
  return fetch(CVESERVICE_URL + '/api/v1/accounts/me', {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(checkStatus)
    .then(parseJSON)
    .then(success);
}

function saveAccount(success, account, token) {
  console.log("Saving account information");

  var data = JSON.stringify(account);

  var requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: data,
    redirect: 'follow'
  };

  fetch(CVESERVICE_URL + "/api/v1/accounts/me", requestOptions)
    .then(checkStatus)
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