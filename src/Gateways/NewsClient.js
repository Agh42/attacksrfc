export const NewsClient = {getArticles, getHotTopics};
export default NewsClient;

const CVESERVICE_URL = process.env.REACT_APP_CVESERVICE_URL;

function getArticles(cve, success) {
    console.log("Fetching articles for: " + cve);
    return fetch(CVESERVICE_URL
        + '/api/v1/articles/search/findDistinctByCvesMentionedInOrderByDatePublishedDesc?cve='
        + encodeURI(cve), {
        headers: {
          Accept: 'application/json',
        },
      }).then(checkStatus)
        .then(parseJSON)
        .then(success);
}

function getHotTopics(success, link = CVESERVICE_URL+'/api/v1/articles?sort=datePublished,desc&size=20') {
  return fetch( link,
    {
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