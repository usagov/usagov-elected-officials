/**
 * Process form data, display address, and search for elected officials.
 */
 function load() {
    var inputEmail = window.location.href.split("input-email=")[1].replace("_", "@");

    var mailForm = document.getElementById("mailForm");
    mailForm.setAttribute("action", "mailto:" + inputEmail);

    var buttonAlt = document.getElementById("button-alt");
    var message = "Having trouble with the button above? Send an email directly to " + inputEmail;
    buttonAlt.innerHTML = message;
}