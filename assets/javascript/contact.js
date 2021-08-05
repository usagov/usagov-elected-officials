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

function setAction() {
    const inputEmail = window.location.href.split("input-email=")[1].replace("_", "@");
    let whatIssue = document.getElementById("input-type-issue");
    let aboutIssue = document.getElementById("input-type-about");
    let actionIssue = document.getElementById("input-type-action");

    let mailForm = document.getElementById("mailForm");

    let body = "The issue I am inquiring about is: %0D%0A" + whatIssue.value + "%0D%0A"
                + "What I have to say about the issue is: %0D%0A" + aboutIssue.value + "%0D%0A";
                + "The action I would like to be taken is: %0D%0A" + actionIssue.value + "%0D%0A";
    let mailAction = "mailto: " + inputEmail + "?" + "subject=Hi, I was inquiring about an issue&body=" + body;
    mailForm.setAttribute("action", mailAction);
}