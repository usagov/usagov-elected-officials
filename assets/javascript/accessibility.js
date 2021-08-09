/**
 * Customize input validation error messages by
 * specifying the name of each input field.
 */
window.addEventListener("load", function() {
    // Add or remove element types from this list,
    // depending on which elements should include
    // the customized input validation error message
    let elementTypes = ["input", "textarea"];

    for (let i = 0; i < elementTypes.length; i++) {
        elements = document.getElementsByTagName(elementTypes[i]);

        for (let j = 0; j < elements.length; j++) {
            // Note: all input fields should have an ID starting with "input-"
            let message = "Please fill out the " + elements[j].id.replace("input-", "") + " field.";
            elements[j].setAttribute("oninvalid", "this.setCustomValidity('" + message + "')");
            elements[j].setAttribute("oninput", "this.setCustomValidity('')");
        }
    }
});
