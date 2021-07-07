/**
 * Build and execute request to look up elected officials for provided address.
 * @param {string} address Address for which to fetch elected officials info.
 * @param {function(Object)} callback Function which takes the
 *     response object as a parameter.
 */
function lookup(address, callback) {
    /**
     * Request object for given parameters.
     * @type {gapi.client.HttpRequest}
     */
    var req = gapi.client.request({
        'path' : '/civicinfo/v2/representatives',
        'params' : {'address' : address}
    });
    req.execute(callback);
}

/**
 * Render results in the DOM.
 * @param {Object} response Response object returned by the API.
 * @param {Object} rawResponse Raw response from the API.
 */
function renderResults(response, rawResponse) {
    var el = document.getElementById('results');
    if (!response || response.error) {
        el.appendChild(document.createTextNode(
            'Error while trying to fetch elected officials'));
        return;
    }
    var normalizedAddress = response.normalizedInput.line1 + ' ' +
        response.normalizedInput.city + ', ' +
        response.normalizedInput.state + ' ' +
        response.normalizedInput.zip;
    if (response.officials.length > 0) {
        for (let i = 0; i < response.officials.length; i++) {
            var normEl = document.createElement('p');
            normEl.appendChild(document.createTextNode(response.officials[i].name));
            el.appendChild(normEl);
        }
    } else {
        el.appendChild(document.createTextNode(
            'Could not find elected officials for ' + normalizedAddress));
    }
}

/**
 * Initialize the API client and make a request.
 */
function start() {
    gapi.client.setApiKey('INSERT API KEY HERE');
    lookup('1263 Pacific Ave. Kansas City KS', renderResults);
}

gapi.load('client', start);
