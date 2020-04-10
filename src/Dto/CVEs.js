import moment from 'moment';

export const CVEs = {colorValueForScore, colorNameForScore, severityForScore, formatDate,
    getHostname, getCpeAsUriBinding, getCpeIdAsUriBinding};
export default CVEs;

const MEDIUM_THRESHOLD = 3.99; // medium severity lower bound exclusive
const HIGH_THRESHOLD = 6.99; // high severity lower bound exclusive
const CRITICAL_THRESHOLD = 8.99; // critical severity lower bound exclusive

const SEVERITY_LOW ="LOW";
const SEVERITY_MEDIUM ="MEDIUM";
const SEVERITY_HIGH ="HIGH";
const SEVERITY_CRITICAL ="CRITICAL";

export const COLOR_RED = "#db2828";
export const COLOR_ORANGE = "#f2711c";
export const COLOR_AMBER = "#fbbd08";
export const COLOR_GREEN = "#21ba45";

function colorValueForScore(score) {
    if (score <= MEDIUM_THRESHOLD) return COLOR_GREEN;
    if (score > CRITICAL_THRESHOLD) return COLOR_RED;
    if (score > HIGH_THRESHOLD) return COLOR_ORANGE;
    return COLOR_AMBER; 
}

function colorNameForScore(score) {
    if (score <= MEDIUM_THRESHOLD) return "green";
    if (score > CRITICAL_THRESHOLD) return "red";
    if (score > HIGH_THRESHOLD) return "orange";
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
    if (!aDate)
        return "";
    let isoDate = aDate['$date'];
    let mom = moment(isoDate, moment.ISO_8601, true);
    return mom.format('YYYY-MM-DD');
}

/*
 * (Previously the URI format of the CPE was used (see NISTIR 7695) because this was how CVEs
 * stored references to CPEs in the database. Now changed to CPE v2.2/2.3 format.)
 * This allows left aligned regex matching to use the database index
 * which speeds up the search significantly.
 *
 */
function getCpeAsUriBinding(cpe) {
    return getCpeIdAsUriBinding(cpe.id);   
}

/*
 * Parses cpe id in v2 format. Cuts off version, update, editien etc.
 */
function getCpeIdAsUriBinding(cpe22) {
    /*let  c,cpeversion,type, vendor, product, version, update, edition, lang, sw_edition, rest;
    [c,cpeversion,type, vendor, product, version, update, edition, lang, sw_edition, ...rest] 
            = this.props.cpe.id.split(":");
    */        
    if (!cpe22) {
        return "";
    }
    let cpeParts = cpe22.split(":");
    
    let head = [...cpeParts]; // todo see if cpe version needs to be unified
    head.length = 5;
    //console.log("Converted CPE to query format: " + head.join(":"));
    return head.join(":");
    
}

