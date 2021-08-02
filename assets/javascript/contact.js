/**
 * Process email from URL, set mailto link, and add email to the bottom of the page.
 */
 function load() {
    const inputEmail = window.location.href.split("input-email=")[1].replace("_", "@");

    let mailForm = document.getElementById("mailForm");
    mailForm.setAttribute("action", "mailto:" + inputEmail);

    // In case the mailto button doesn't work,
    // display email for user to manually input
    let buttonAlt = document.getElementById("button-alt");
    let message = "Having trouble with the button above? Send your concern directly to " + inputEmail;
    buttonAlt.innerHTML = message;
}
