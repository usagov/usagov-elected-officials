/**
 * Process email from URL, set mailto link with that email, and add email to bottom of the page.
 */
 function load() {
    var inputEmail = window.location.href.split("input-email=")[1].replace("_", "@");

    var mailForm = document.getElementById("mailForm");
    mailForm.setAttribute("action", "mailto:" + inputEmail);

    var buttonAlt = document.getElementById("button-alt");
    var message = "Having trouble with the button above? Send your concern directly to " + inputEmail;
    buttonAlt.innerHTML = message;
}