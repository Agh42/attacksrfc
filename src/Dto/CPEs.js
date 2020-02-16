export const CPEs = {vendorProduct, escapeRegexCharacters};
export default CPEs;

/**
 * Return vendor and product depending on cpe format.
 * 
 * @param {string} cpeId 
 */
function vendorProduct(cpeId) {
    return (cpeId.split(":")[1].match(/\d.\d/))
        ? decodeCPE(cpeId.split(":")[3] + " " + cpeId.split(":")[4])
        : decodeCPE(cpeId.split(":")[2] + " " + cpeId.split(":")[3]);
}

function decodeCPE(cpeId) {
    return decodeURIComponent(cpeId).replace(/\\!/g, "!");
}

// Escape special characters.
// Taken from https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}