/**
 * Process form data, display address, and search for elected officials.
 */
 function load() {
    var inputStreet = window.location.href.split("input-street=")[1].split("&")[0].split("+").join(" ");
    var inputCity = window.location.href.split("input-city=")[1].split("&")[0].split("+").join(" ");
    var inputState = window.location.href.split("input-state=")[1].split("&")[0];
    var inputZip = window.location.href.split("input-zip=")[1].split("&")[0];

    var inputEmail = window.location.href.split("input-email")[1].split("&")[0];

    var normalizedAddress = inputStreet + ", " + inputCity + ", " + inputState + " " + inputZip;

    var displayAddress = document.getElementById("display-address");
    displayAddress.innerHTML = normalizedAddress.replace(", ", "<br>");
}