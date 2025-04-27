"use strict";

const currentWorkspace = "converter";
const setCurrentBtn = document.getElementById("getCurrentTime");
const datetimeInput  = document.getElementById("datetime");
const fromTimezoneSelect = document.getElementById("fromTimezoneSelect");
const toTimezoneSelect = document.getElementById("toTimezoneSelect");
const swipeBtn = document.getElementById("swapTimezones");
const convertBtn = document.getElementById("convertBtn");
const conversionResult = document.getElementById("conversionResult");
const resultText = document.getElementById("resultText");
const copyBtn = document.getElementById("copyBtn");
const tabs = document.getElementsByClassName("converter__tab");

const TIME_ZONES = [
    "UTC",
    "Pacific/Pago_Pago",
    "Pacific/Honolulu",
    "America/Anchorage",
    "America/Los_Angeles",
    "America/Denver",
    "America/Chicago",
    "America/New_York",
    "America/Halifax",
    "America/Sao_Paulo",
    "Atlantic/South_Georgia",
    "Atlantic/Azores",
    "Europe/London",
    "Europe/Berlin",
    "Europe/Kyiv",
    "Europe/Moscow",
    "Asia/Dubai",
    "Asia/Karachi",
    "Asia/Tashkent",
    "Asia/Dhaka",
    "Asia/Bangkok",
    "Asia/Shanghai",
    "Asia/Tokyo",
    "Australia/Sydney",
];

function setOptions(select, optionList, defaultValue) {

    const fragment = document.createDocumentFragment();

    optionList.forEach((item) => {
        const optionEl = document.createElement("option");
        optionEl.textContent = item;
        optionEl.value = item;

        if(item === defaultValue) {
            optionEl.selected = true;
        }

        fragment.appendChild(optionEl);
    });
    
    select.appendChild(fragment);
}

setOptions(fromTimezoneSelect, TIME_ZONES);
setOptions(toTimezoneSelect, TIME_ZONES, "Asia/Tashkent");

function updateTimezone(select, selectedValue) {
    select.value = selectedValue;
}

function swipeTimezones(select1, select2) {
    const lamp = select1.value;
    updateTimezone(select1, select2.value);
    updateTimezone(select2, lamp);
}

function toLocalDateTimeString(date){
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function setCurrentTime() {
    if(datetimeInput) {
        const current = new Date();
        datetimeInput.value = toLocalDateTimeString(current);
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");

    if(!toast) {
        console.warn("Toast element not found");
        return ;
    }

    toast.textContent = message || "Copied!"
    toast.style.visibility = "visible";
    toast.style.opacity = "1";

    setTimeout(() => {
        toast.style.visibility = "hidden";
        toast.style.opacity = "0";
    }, 2000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showToast();
            console.log("Text copied successfully!")
        })
        .catch((err) => {
            console.error("Error writing to clipboard ", err);
        })
}

function showResult(date) {
    conversionResult.style.display = "flex";

    const formatOptions = {
        timeZone: toTimezoneSelect.value,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };

    const formatedDate = date.toLocaleString("en-US", formatOptions);
    resultText.textContent = formatedDate;
}

function convertTime() {
    const inputDatetime = new Date(datetimeInput.value);
    const sourceTimeZoneDate = new Date(inputDatetime.toLocaleString("en-US", { timeZone: fromTimezoneSelect.value }));
    const timeZoneOffsetMinutes = Math.floor((inputDatetime.getTime() - sourceTimeZoneDate.getTime()) / 60000);

    const adjustedDateTime = new Date(sourceTimeZoneDate.getTime() + (timeZoneOffsetMinutes * 60 * 1000) * 2);

    showResult(adjustedDateTime);
}

setCurrentBtn.addEventListener("click", setCurrentTime);
swipeBtn.addEventListener("click", () => swipeTimezones(fromTimezoneSelect, toTimezoneSelect));
convertBtn.addEventListener("click", convertTime);
copyBtn.addEventListener("click", () => copyToClipboard(resultText.textContent));

tabs[1].addEventListener("click", () => {
    showToast("Coming soon!")
}); // World Map tab click