import moment from 'moment';

export const CVEs = {colorValueForScore, colorNameForScore, severityForScore, formatDate, getHostname};
export default CVEs;

const MEDIUM_THRESHOLD = 3.99; // medium severity lower bound exclusive
const HIGH_THRESHOLD = 6.99; // high severity lower bound exclusive
const CRITICAL_THRESHOLD = 8.99; // critical severity lower bound exclusive

const SEVERITY_LOW ="LOW";
const SEVERITY_MEDIUM ="MEDIUM";
const SEVERITY_HIGH ="HIGH";
const SEVERITY_CRITICAL ="CRITICAL";

function colorValueForScore(score) {
    if (score <= MEDIUM_THRESHOLD) return "#11A100"; //green
    if (score > HIGH_THRESHOLD) return "#db0000"; // red
    return "#ffa200"; //amber
}

function colorNameForScore(score) {
    if (score <= MEDIUM_THRESHOLD) return "green";
    if (score > HIGH_THRESHOLD) return "red";
    return "yellow";
}

function severityForScore(score) {
    if (score <= MEDIUM_THRESHOLD) return SEVERITY_LOW;
    if (score > CRITICAL_THRESHOLD) return SEVERITY_CRITICAL;
    if (score > HIGH_THRESHOLD) return SEVERITY_HIGH;
    return SEVERITY_MEDIUM;
}

/**
 * getHostname()
 * Thanks for this function to
 * @author Finn Westendorf
 * @param {any} url
 */
function getHostname(url) {
    var a = document.createElement("a");
    a.href = url;
    return a.hostname;
}

function formatDate(aDate) {
    let isoDate = aDate['$date'];
    let mom = moment(isoDate, moment.ISO_8601, true);
    return mom.format('YYYY-MM-DD');
}

