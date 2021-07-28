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

        var levels = ["Federal", "State", "Local"];
        for (let i = 0; i < levels.length; i++) {
            var accordianHeader = document.createElement("h2");
            accordianHeader.setAttribute("class", "usa-accordion__heading");
            var accordianHeaderButton = document.createElement("button");
            accordianHeaderButton.setAttribute("class", "usa-accordion__button");
            accordianHeaderButton.setAttribute("aria-expanded", "true");

            var controlNumber = levels[i] + " Officials";
            accordianHeaderButton.setAttribute("aria-controls", controlNumber);

            accordianHeaderButton.innerHTML =  levels[i] + " Officials";

            accordianHeader.appendChild(accordianHeaderButton);

            var accordianContent = document.createElement("div");
            accordianContent.setAttribute("id", levels[i] + " Officials");
            accordianContent.setAttribute("class", "usa-accordion__content usa-prose")

            elem.appendChild(accordianHeader);
            elem.appendChild(accordianContent);
        }

        el.appendChild(elem);

        for (let i = 0; i < response.officials.length; i++) {
            var titleHeader = document.createElement("h3");
            titleHeader.setAttribute("class", "font-serif-md");
            titleHeader.style.color = "rgb(26, 54, 85)";
            titleHeader.innerHTML = response.officials[i].name + ", " + response.officials[i].office;

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

            /*
            *   Check to see if the representative has a party affiliation, if not, do not display.
            */

            var partyValid = response.officials[i].party || "None";
            if (partyValid != "None") {
                var firstElem = document.createElement("li");
                firstElem.innerHTML = "Party Affiliation: " + response.officials[i].party;
                bulletList.appendChild(firstElem);
            } 

            /*
            *   Check to see if the representative has a physical address, if not, say None provided.
            */

            var secondElem = document.createElement("li");
            var addressValid = response.officials[i].address || "None provided";
            if (addressValid) {
                if (addressValid != "None provided") {
                    var addressTogether = response.officials[i].address[0].line1 + " " + response.officials[i].address[0].city + ", " + 
                    response.officials[i].address[0].state + " " + response.officials[i].address[0].zip;
                    secondElem.innerHTML = "Address: " + addressTogether;
                } else {
                    secondElem.innerHTML = "Address: None provided";
                }
            }

            bulletList.appendChild(secondElem);

            /*
            *   Check to see if the representative has a phone number, if not, say None provided.
            */

            var thirdElem = document.createElement("li");
            var phoneValid = response.officials[i].phones || "None";
            if (phoneValid != "None") {
                thirdElem.innerHTML = "Phone number: " + response.officials[i].phones[0];
            } else {
                thirdElem.innerHTML = "Phone number: None provided";
            }

            bulletList.appendChild(thirdElem);

            /*
            *   Check to see if the representative has a website, if not, say None provided.
            */

            var websiteValid = response.officials[i].urls || "None";
            var fourthElem = document.createElement("li");
            if (websiteValid != "None") {
                fourthElem.innerHTML = "Website: ";
                var link = document.createElement("a");
                link.setAttribute("href", response.officials[i].urls[0]);
                link.innerHTML = response.officials[i].urls[0];
                fourthElem.appendChild(link);
            } else {
                fourthElem.innerHTML = "Website: None provided";
            }

            bulletList.appendChild(fourthElem);

            /*
            *   Check to see if the representative has social media, if not, do not display.
            */

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

            /*
            *   Check to see if the representative has an email, if not, do not display contact button
            */

            var emails = response.officials[i].emails || "None";
            if (emails != "None") {
                var primaryEmail = document.createElement("button");
                var linkToContact = document.createElement("a");
                var emailLinkified = response.officials[i].emails[0].replace("@", "_");
                linkToContact.setAttribute("href", "/pages/contact.html?input-email=" + emailLinkified);
                primaryEmail.setAttribute("class", "usa-button usa-button--accent-cool");
                primaryEmail.style.marginTop = "15px";
                primaryEmail.innerHTML = "Contact via Email";
                linkToContact.appendChild(primaryEmail);
                bulletList.appendChild(linkToContact);
            }

            accordianContent.appendChild(bulletList);

            var appendLocation;
            var level = response.officials[i].level;
            if (level == "country") {
                appendLocation = document.getElementById("Federal Officials");
            } else if (level == "administrativeArea1") {
                appendLocation = document.getElementById("State Officials");
            }  else {
                appendLocation = document.getElementById("Local Officials");
            }

            appendLocation.appendChild(titleHeader);
            appendLocation.appendChild(accordianHeader);
            appendLocation.appendChild(accordianContent);
        }
    } else {
        el.appendChild(document.createTextNode(
            "Could not find elected officials for " + normalizedAddress));
    }
}

/**
 * Populate the page with filler values for
 * offline testing (i.e. without the API key)
 */
function offlineTest() {
    var el = document.getElementById("results");

    var elem = document.createElement("div");
    elem.setAttribute("class", "usa-accordion");
    elem.setAttribute("aria-multiselectable", "true")

    var levels = ["Website Creators", "Filler Values"];
    for (let i = 0; i < levels.length; i++) {
        var accordianHeader = document.createElement("h2");
        accordianHeader.setAttribute("class", "usa-accordion__heading");
        var accordianHeaderButton = document.createElement("button");
        accordianHeaderButton.setAttribute("class", "usa-accordion__button");
        accordianHeaderButton.setAttribute("aria-expanded", "true");

        var controlNumber = levels[i];
        accordianHeaderButton.setAttribute("aria-controls", controlNumber);

        accordianHeaderButton.innerHTML =  levels[i];

        accordianHeader.appendChild(accordianHeaderButton);

        var accordianContent = document.createElement("div");
        accordianContent.setAttribute("id", levels[i]);
        accordianContent.setAttribute("class", "usa-accordion__content usa-prose")

        elem.appendChild(accordianHeader);
        elem.appendChild(accordianContent);
    }

    el.appendChild(elem);

    const response = {
        officials: [
            {
                name: "Charlie Liu",
                office: "Website Creator",
                party: "General Services Administration",
                address: [{line1: "123 Main Street", city: "Somewhere", state: "DC", zip: "12345"}],
                phones: ["(123) 456-7890"],
                urls: ["https://usa.gov/elected-officials"],
                channels: [{type: "LinkedIn", id: "cliu13"}],
                emails: ["charlie.liu@gsa.gov"],
                level: "creator"
            },
            {
                name: "Jacob Cuomo",
                office: "Website Creator",
                party: "General Services Administration",
                address: [{line1: "123 Main Street", city: "Somewhere", state: "DC", zip: "12345"}],
                phones: ["(123) 456-7890"],
                urls: ["https://usa.gov/elected-officials"],
                channels: [{type: "LinkedIn", id: "jacob-cuomo-659937125"}],
                emails: ["jacob.cuomo@gsa.gov"],
                level: "creator"
            },
            {
                name: "John Smith",
                office: "Filler Value",
                party: "Democratic Party",
                level: "filler"
            },
            {
                name: "Jane Doe",
                office: "Filler Value",
                party: "Republican Party",
                level: "filler"
            }
        ]
    }

    for (let i = 0; i < response.officials.length; i++) {
        var titleHeader = document.createElement("h3");
        titleHeader.setAttribute("class", "font-serif-md");
        titleHeader.style.color = "rgb(26, 54, 85)";
        titleHeader.innerHTML = response.officials[i].name + ", " + response.officials[i].office;

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

        /*
        *   Check to see if the representative has a party affiliation, if not, do not display.
        */

        var partyValid = response.officials[i].party || "None";
        if (partyValid != "None") {
            var firstElem = document.createElement("li");
            firstElem.innerHTML = "Party Affiliation: " + response.officials[i].party;
            bulletList.appendChild(firstElem);
        } 

        /*
        *   Check to see if the representative has a physical address, if not, say None provided.
        */

        var secondElem = document.createElement("li");
        var addressValid = response.officials[i].address || "None provided";
        if (addressValid) {
            if (addressValid != "None provided") {
                var addressTogether = response.officials[i].address[0].line1 + " " + response.officials[i].address[0].city + ", " + 
                response.officials[i].address[0].state + " " + response.officials[i].address[0].zip;
                secondElem.innerHTML = "Address: " + addressTogether;
            } else {
                secondElem.innerHTML = "Address: None provided";
            }
        }

        bulletList.appendChild(secondElem);

        /*
        *   Check to see if the representative has a phone number, if not, say None provided.
        */

        var thirdElem = document.createElement("li");
        var phoneValid = response.officials[i].phones || "None";
        if (phoneValid != "None") {
            thirdElem.innerHTML = "Phone number: " + response.officials[i].phones[0];
        } else {
            thirdElem.innerHTML = "Phone number: None provided";
        }

        bulletList.appendChild(thirdElem);

        /*
        *   Check to see if the representative has a website, if not, say None provided.
        */

        var websiteValid = response.officials[i].urls || "None";
        var fourthElem = document.createElement("li");
        if (websiteValid != "None") {
            fourthElem.innerHTML = "Website: ";
            var link = document.createElement("a");
            link.setAttribute("href", response.officials[i].urls[0]);
            link.innerHTML = response.officials[i].urls[0];
            fourthElem.appendChild(link);
        } else {
            fourthElem.innerHTML = "Website: None provided";
        }

        bulletList.appendChild(fourthElem);

        /*
        *   Check to see if the representative has social media, if not, do not display.
        */

        var socials = response.officials[i].channels || "None";
        if (socials != "None") {
            for (var j = 0; j < socials.length; j++) {
                var nextElem = document.createElement("li");
                var linkToSocial = document.createElement("a");
                if (socials[j].type.toLowerCase() == "linkedin") {
                    linkToSocial.setAttribute("href", "https://linkedin.com/in/" + socials[j].id);
                }
                linkToSocial.innerHTML = "@" + socials[j].id;
                nextElem.innerHTML = socials[j].type + ": ";
                nextElem.appendChild(linkToSocial);
                bulletList.appendChild(nextElem);
            }
        }

        /*
        *   Check to see if the representative has an email, if not, do not display contact button
        */

        var emails = response.officials[i].emails || "None";
        if (emails != "None") {
            var primaryEmail = document.createElement("button");
            var linkToContact = document.createElement("a");
            var emailLinkified = response.officials[i].emails[0].replace("@", "_");
            linkToContact.setAttribute("href", "/pages/contact.html?input-email=" + emailLinkified);
            primaryEmail.setAttribute("class", "usa-button usa-button--accent-cool");
            primaryEmail.style.marginTop = "15px";
            primaryEmail.innerHTML = "Contact via Email";
            linkToContact.appendChild(primaryEmail);
            bulletList.appendChild(linkToContact);
        }

        accordianContent.appendChild(bulletList);

        var appendLocation;
        var level = response.officials[i].level;
        if (level == "creator") {
            appendLocation = document.getElementById("Website Creators");
        }  else {
            appendLocation = document.getElementById("Filler Values");
        }

        appendLocation.appendChild(titleHeader);
        appendLocation.appendChild(accordianHeader);
        appendLocation.appendChild(accordianContent);
    }
}

/**
 * Initialize the API client.
 */
 function start() {
    gapi.client.setApiKey("INSERT_API_KEY");
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

    if (normalizedAddress == "123 Main Street, Somewhere, DC 12345") {
        console.log("[DEBUG] Offline testing enabled!");
        offlineTest();
        return;
    }

    lookup(normalizedAddress, renderResults);
}

gapi.load("client", start);
