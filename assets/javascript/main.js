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
        var elem = document.createElement("div");
        elem.setAttribute("class", "usa-accordion");
        elem.setAttribute("aria-multiselectable", "true")
        for (let i = 0; i < response.officials.length; i++) {
            console.log(response);

            var titleHeader = document.createElement("h2");
            titleHeader.setAttribute("class", "font-serif-md");
            titleHeader.style.color = "rgb(26, 54, 85)";
            titleHeader.innerHTML = response.officials[i].name + ", " + response.officials[i].office;

            // Adds the title, such as President
            elem.appendChild(titleHeader);
            
            var accordianHeader = document.createElement("h4");
            accordianHeader.setAttribute("class", "usa-accordion__heading");
            var accordianHeaderButton = document.createElement("button");
            accordianHeaderButton.setAttribute("class", "usa-accordion__button");
            accordianHeaderButton.setAttribute("aria-expanded", "true");
            var controlNumber = "m-a" + i;
            accordianHeaderButton.setAttribute("aria-controls", controlNumber);
            accordianHeaderButton.innerHTML = "Contact " + response.officials[i].name;

            accordianHeader.appendChild(accordianHeaderButton);

            var accordianContent = document.createElement("div");
            accordianContent.setAttribute("id", controlNumber);
            accordianContent.setAttribute("class", "usa-accordion__content usa-prose")

            var bulletList = document.createElement("ul");
            var firstElem = document.createElement("li");
            firstElem.innerHTML = "Party Affiliation: " + response.officials[i].party;
            bulletList.appendChild(firstElem);

            var secondElem = document.createElement("li");
            var addressValid = response.officials[i].address || "None provided";
            if (addressValid) {
                console.log(addressValid);
                if (addressValid != "None provided") {
                    var addressTogether = response.officials[i].address[0].line1 + " " + response.officials[i].address[0].city + ", " + 
                    response.officials[i].address[0].state + " " + response.officials[i].address[0].zip;
                    secondElem.innerHTML = "Address: " + addressTogether;
                } else {
                    secondElem.innerHTML = "Address: None provided";
                }
            }

            bulletList.appendChild(secondElem);

            var thirdElem = document.createElement("li");
            thirdElem.innerHTML = "Phone number: " + response.officials[i].phones[0];

            bulletList.appendChild(thirdElem);

            var fourthElem = document.createElement("li");
            fourthElem.innerHTML = "Website: ";
            var link = document.createElement("a");
            link.setAttribute("href", response.officials[i].urls[0]);
            link.innerHTML = response.officials[i].urls[0];
            fourthElem.appendChild(link);

            bulletList.appendChild(fourthElem);

            var socials = response.officials[i].channels || "None";
            if (socials != "None") {
                for (var j = 0; j < socials.length; j++) {
                    var nextElem = document.createElement("li");
                    var linkToSocial = document.createElement("a");
                    if (socials[j].type.toLowerCase() == "twitter") {
                        linkToSocial.setAttribute("href", "https://twitter.com/" + socials[j].id);
                    } else if (socials[j].type.toLowerCase() == "facebook") {
                        linkToSocial.setAttribute("href", "https://facebook.com/" + socials[j].id);
                    }
                    linkToSocial.innerHTML = "@" + socials[j].id;
                    nextElem.innerHTML = socials[j].type + ": ";
                    nextElem.appendChild(linkToSocial);
                    bulletList.appendChild(nextElem);
                }
            }

            accordianContent.appendChild(bulletList);

            elem.appendChild(accordianHeader);
            elem.appendChild(accordianContent);

        }
        el.appendChild(elem);
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
