var autocomplete;

/**
 * Fill in address components with auto-completed values.
 */
function fillInAddress() {
    var place = autocomplete.getPlace();
    var streetAddress = "";

    for (var component of place.address_components) {
        var componentType = component.types[0];

        switch (componentType) {
            case "street_number": {
                streetAddress = `${component.long_name} ${streetAddress}`;
                break;
            }

            case "route": {
                streetAddress += component.short_name;
                break;
            }

            case "postal_code": {
                document.getElementById("input-zip").value = component.long_name;
                break;
            }

            case "locality": {
                document.getElementById("input-city").value = component.long_name;
                break;
            }

            case "administrative_area_level_1": {
                // Not actually selecting the option - only updates the text and
                // value that is being sent to the next page. Potential issue?
                document.getElementById("input-state").value = component.long_name;
                document.getElementById(component.short_name).selected = true;
                break;
            }
        }
    }
    document.getElementById("input-street").value = streetAddress;
}

/**
 * Set up the Google Places Autocomplete feature.
 */
function load() {
    var inputStreet = document.getElementById("input-street");
    inputStreet.focus();

    var options = {
        componentRestrictions: {country: "us"},
        fields: ["address_components"],
        types: ["address"],
    }

    autocomplete = new google.maps.places.Autocomplete(inputStreet, options);
    autocomplete.addListener("place_changed", fillInAddress);
}
