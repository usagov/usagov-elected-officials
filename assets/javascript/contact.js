/**
 * Process form data, display address, and search for elected officials.
 */
 function load() {
    var inputEmail = window.location.href.split("input-email=")[1].replace("_", "@");

    var mailForm = document.getElementById("mailForm");
    mailForm.setAttribute("action", "mailto:" + inputEmail);
}