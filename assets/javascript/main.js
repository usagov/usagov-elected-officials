/**
 * Build and execute request to look up elected officials for provided address.
 * @param {string} address Address for which to fetch elected officials info.
 * @param {function(Object)} callback Function which takes the response object as a parameter.
 */
function lookup(address, callback) {
    /**
     * Request object for given parameters.
     * @type {gapi.client.HttpRequest}
     */
    var req = gapi.client.request({
        "path" : "/civicinfo/v2/representatives",
        "params" : {"address" : address}
    });
    req.execute(callback);
}

/**
 * Render results in the DOM.
 * @param {Object} response Response object returned by the API.
 * @param {Object} rawResponse Raw response from the API.
 */
function renderResults(response, rawResponse) {
    var el = document.getElementById("results");
    if (!response || response.error) {
        el.appendChild(document.createTextNode(
            "Error while trying to fetch elected officials"));
        return;
    }
    var normalizedAddress = response.normalizedInput.line1 + ", " +
        response.normalizedInput.city + ", " +
        response.normalizedInput.state + " " +
        response.normalizedInput.zip;

    for (let i = 0; i < response.offices.length; i++) {
        for (let j = 0; j < response.offices[i].officialIndices.length; j++) {
            var officialIndex = response.offices[i].officialIndices[j];
            response.officials[officialIndex].office = response.offices[i].name;
            response.officials[officialIndex].level = response.offices[i].levels[0];
        }
    }

    if (response.officials.length > 0) {
        for (let i = 0; i < response.officials.length; i++) {
            var normEl = document.createElement("p");
            normEl.appendChild(document.createTextNode(response.officials[i].name + ": " +
                response.officials[i].office + " (" + response.officials[i].level + ")"));
            el.appendChild(normEl);
        }
    } else {
        el.appendChild(document.createTextNode(
            "Could not find elected officials for " + normalizedAddress));
    }
}

/**
 * Initialize the API client.
 */
 function start() {
    gapi.client.setApiKey("INSERT API KEY HERE");
}

/**
 * Process form data, display address, and search for elected officials.
 */
function load() {
    var inputStreet = window.location.href.split("input-street=")[1].split("&")[0].split("+").join(" ");
    var inputCity = window.location.href.split("input-city=")[1].split("&")[0].split("+").join(" ");
    var inputState = window.location.href.split("input-state=")[1].split("&")[0];
    var inputZip = window.location.href.split("input-zip=")[1].split("&")[0];

    var normalizedAddress = inputStreet + ", " + inputCity + ", " + inputState + " " + inputZip;

    var displayAddress = document.getElementById("display-address");
    displayAddress.innerHTML = normalizedAddress.replace(", ", "<br>");

    lookup(normalizedAddress, renderResults);
}

gapi.load("client", start);
