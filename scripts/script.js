"use strict";
let x, y, r;

window.onload = function () {
    let buttons = document.querySelectorAll("input[name=r_btn]");
    buttons.forEach(click);

    function click(element) {
        element.onclick = function () {
            x = this.value;
        }
    }
};

document.getElementById("checkButton").onclick = function () {
    if (validateX() && validateY() && validateR()) {
        let str = '?x=' + x + '&y=' + y + '&r=' + r;
        fetch("scripts/answer.php" + str, {
            method: "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
        }).then(response => response.text()).then(function (serverAnswer) {
            setPointer();
            document.getElementById("outputContainer").innerHTML = serverAnswer;
        }).catch(err => createNotification("Ошибка HTTP. Повторите попытку позже." + err));
    }
};

function setPointer() {
    let pointer = document.getElementById("pointer");
    pointer.style.visibility = "visible";
    pointer.setAttribute("cx", (x/r*2 * 60 + 150));
    pointer.setAttribute("cy", (-y/r*2 * 60 + 150));
}

function createNotification(message) {
    let outputContainer = document.getElementById("outputContainer");
    if (outputContainer.contains(document.querySelector(".notification"))) {
        let stub = document.querySelector(".notification");
        stub.textContent = message;
        stub.classList.replace("outputStub", "errorStub");
    } else {
        let notificationTableRow = document.createElement("h4");
        notificationTableRow.innerHTML = "<span class='notification errorStub'></span>";
        outputContainer.prepend(notificationTableRow);
        let span = document.querySelector(".notification");
        span.textContent = message;
    }
}

function validateX() {
    try {
        x = document.querySelector("input[type=radio]:checked").value;
        return true;
    } catch (err) {
        createNotification("Значение X не выбрано");
        return false;
    }
}

function validateY() {
    y = document.querySelector("input[name=y_in]").value.replace(",", ".");
    if (y === undefined) {
        createNotification("Y не введён");
        return false;
    } else if (!isNumeric(y)) {
        createNotification("Y не число");
        return false;
    } else if (!((y > -3) && (y < 5))) {
        createNotification("Y не входит в область допустимых значений");
        return false;
    } else return true;
}

function validateR() {
    try {
        r = document.querySelector("select[name=r_btn]").value;
        return true;
    } catch (err) {
        createNotification("Значение R не выбрано");
        return false;
    }
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}