import { focusState } from "./utilConsts.js";
import { filterSuggestions } from "/utilFunc.js";

//Event listener for enter and arrow keys, sets focus and inputs the top or the current focus image when pressing enter
export function handleKeydown({
    inputFunction,
    focusState
}) {

    return function(event) {
        let query = this.value.toLowerCase();

        if (query === '') {
            return;
        }

        let x = document.getElementsByClassName("suggestionItem");

        if (event.keyCode == 40) {
            event.preventDefault();
            if (focusState.focusActive === false) {
                focusState.focusActive = true;
                focusState.currentFocus = 0;
            } else {
                x[focusState.currentFocus].classList.remove("active");
                focusState.currentFocus++;
            }
            if (focusState.currentFocus === x.length) {
                focusState.currentFocus = 0;
            }
            x[focusState.currentFocus].classList.add("active");
        }
        else if (event.keyCode == 38) {
            event.preventDefault();
            if (focusState.focusActive === false) {
                focusState.focusActive = true;
                focusState.currentFocus = x.length - 1;
            } else {
                x[focusState.currentFocus].classList.remove("active");
                focusState.currentFocus--;
            }
            if (focusState.currentFocus < 0) {
                focusState.currentFocus = x.length - 1;
            }
            x[focusState.currentFocus].classList.add("active");
        }
        else if (event.keyCode === 13) {
            inputFunction();
        }
        else {
            focusState.focusActive = false;
            focusState.currentFocus = 0;
        }
    }
}

export function handleInput({
    availableAnswers,
    includesQuery = false,
    suggestionsContainer,
    inputContent,
    callback,
    path = ""
}) {
    return function() {
        let query = this.value.toLowerCase();
        suggestionsContainer.innerHTML = '';

        if (query === '') {
            return;
        }
        let suggestions = filterSuggestions({
            query: query,
            availableAnswers: availableAnswers(),
            includesQuery: includesQuery
        })
        suggestions = suggestions.map(name => name.replace(/_/g, ":"));

        suggestions.forEach(suggestion => {
            let suggestionItem = document.createElement("div");
            suggestionItem.classList.add('suggestionItem');
            suggestionItem.innerHTML = path !== "" ? '<img src="' + path + suggestion + '.webp">' + suggestion : suggestion;
            suggestionsContainer.appendChild(suggestionItem);

            //event listener for click in suggestion items
            //IMPORTANT NOTE: Currently splits at > since this is the indicator for end of img tag, when changing keep in mind
            suggestionItem.addEventListener("click", function() {
                inputContent.value = path !== "" ? this.innerHTML.replace(/:/g, "_").split(">")[1] : this.innerHTML.replace(/:/g, "_");
                callback();
            })
        })
    }
}

export function handleMouseover({
    focusState
}) {
    return function() {
        focusState.focusActive = false;
        focusState.currentFocus = 0;
        let active = document.getElementsByClassName("active");
        if (active.length > 0) {
            active[0].classList.remove("active");
        }
    }
}