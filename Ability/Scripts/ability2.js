import { autocompleteInput, checkInput, removeItem  } from "/utilFunc.js";
import { correctColor, wrongColor } from "/utilConsts.js";

//not const variables
let abilityList = [];
let classList = [];
let availableClasses = [];
let genderUnlockGroups = [];

//variables for testing
let dailyClass = "Slayer";
let dailySkill = "Wild Stomp";
let focusActive = false;
let currentFocus = 0;

//id selectors
const classInputContent = document.getElementById("classInputGuess");
const guessTable = document.getElementById("guessTable");
const classInputContainer = document.getElementById("classInputContainer");
const responseMessage = document.getElementById("responseMessage");
const responseContainer = document.getElementById("responseContainer");

//event listeners
document.getElementById("classInputSubmit").addEventListener("click", readClassInput);

//fetch for jsons
Promise.all([
    fetch("/Ability/Objects/abilityList.json").then(response => response.json()),
    fetch("/Ability/Objects/genderUnlock.json").then(response => response.json())
])
    .then(([abilityListData, genderUnlockData]) => {
        abilityList = abilityListData;
        classList = Object.keys(abilityList);
        availableClasses = Object.keys(abilityList);
        availableClasses.sort();

        genderUnlockGroups = genderUnlockData;
    })
.catch(error => console.error("Error loading data:", error));


function readClassInput () {

    let autocomplete = autocompleteInput({
        inputContent: classInputContent,
        availableAnswers: availableClasses,
        focusActive: focusActive,
        currentFocus: currentFocus,
        includesQuery: false
    });
    alert(autocomplete);

    if (checkInput({
        availableAnswers: availableClasses,
        input: autocomplete,
        guessTable: guessTable,
        callback: createRow
    })) {
        if (focusActive) {
            removeItem(availableClasses, autocomplete);
            focusActive = false;
        }else {
            removeItem(availableClasses, autocomplete);
        }
    }

    classInputContent.value = "";
    classInputContent.focus();
}

function createRow(indexOfChar) {
    let newRow = guessTable.insertRow(0);
    let classGuess = classList[indexOfChar];
    let newCell = newRow.insertCell(0);
    newCell.innerHTML = classGuess;

    if (classList[indexOfChar] === dailyClass) {
        newCell.style.backgroundColor = correctColor;
        correctGuess();
        alternateClass = dailyClass;
        alternateSkill = dailySkill;

        responseMessage.innerHTML = '<h2>Nice!</h2><p>Can you also guess the ability name?</p>';

    } else if (checkForGenderUnlock(classGuess)) {
        newCell.style.backgroundColor = correctColor;
        correctGuess();

        responseMessage.innerHTML = '<h2>Nice!</h2><p>The daily class was ' + dailyClass + ', but since this is also a skill for ' + dailyClass + ' it counts!</p><p>Can you also guess the ability name?</p>';

    } else newCell.style.backgroundColor = wrongColor;
}

function correctGuess () {
    classInputContainer.style.display = "none";
    responseContainer.style.display = "block";
    return;
}

//returns true or false if daily skill is eligible for gender unlock and entered character is the opposite gender of it
function checkForGenderUnlock(classGuess) {
    for (let indexGroup = 0; indexGroup < genderUnlockGroups.groups.length; indexGroup++) {
        for (let indexClass = 0; indexClass < genderUnlockGroups.groups[indexGroup].groupID.length; indexClass++) {
            if (dailyClass === genderUnlockGroups.groups[indexGroup].groupID[indexClass]) {
                let firstClass = genderUnlockGroups.groups[indexGroup].groupID[0];
                let secondClass = genderUnlockGroups.groups[indexGroup].groupID[1];
                if (classGuess === firstClass || classGuess === secondClass) {
                    if (firstClass === dailyClass) {
                        for (let indexSkill = 0; indexSkill < genderUnlockGroups.groups[indexGroup].skills.length; indexSkill++) {
                            if (dailySkill === genderUnlockGroups.groups[indexGroup].skills[indexSkill][firstClass]) {
                                dailyClass = secondClass;
                                dailySkill = genderUnlockGroups.groups[indexGroup].skills[indexSkill][secondClass];
                                return true;
                            }
                        }
                    } else for (let indexSkill = 0; indexSkill < genderUnlockGroups.groups[indexGroup].skills.length; indexSkill++) {
                        if (dailySkill === genderUnlockGroups.groups[indexGroup].skills[indexSkill][secondClass]) {
                            dailyClass = firstClass;
                            dailySkill = genderUnlockGroups.groups[indexGroup].skills[indexSkill][firstClass];
                            return true;
                        }
                    }
                }
                return false;
            }
        }
    }
    return false;
}