// MEAL API ENDPOINTS 
const MEAL_API_RANDOM  = 'https://www.themealdb.com/api/json/v1/1/random.php';
const MEAL_API_SEARCH = 'https://www.themealdb.com/api/json/v1/1/search.php?';

// Input / Form Elements
const mealSearchBtn   = document.querySelector("#meal-search-button")
const mealSearchText =  document.querySelector("#meal-search-text");

// Main Body Elements
const foodInputEl     = document.querySelector("#meal-search-form");
const foodDivEl       = document.querySelector("#food-result");
const columnsEl       = document.querySelector(".columns");

// Display meal summary from fetch response data
// 
var displayMeal = function(data,searchTerm) {
    console.log(data);
    if (!data.meals) {
        displayModal(`Sorry, no results for '${searchTerm}'`);
    }
    foodDivEl.innerHTML = ""; // Clear last meal display
    
    // Pick a random meal from the search results
    let randIndex=randBetween(0,data.meals.length);
    let meal = data.meals[randIndex];
    console.log(meal);

    // Get data from the meal
    var mealImgURL = meal.strMealThumb;
    var mealName = meal.strMeal;
    var mealYoutubeURL = meal.strYoutube;
    var mealCategory = meal.strCategory;
    
    // Create DOM elements
    let foodBlockEl = document.createElement('div');
    foodBlockEl.className = "columns is-mobile mt-3"

    var foodContentEl = document.createElement('div');
    foodContentEl.className = 'column is-half';
    foodContentEl.innerHTML = `<span><a href="#0" class="subtitle">${mealCategory}</a></span><h3 class="title">${mealName}</h3>`
    foodBlockEl.appendChild(foodContentEl);

    var mealYoutubeEl = document.createElement("a");
    mealYoutubeEl.href=mealYoutubeURL;
    foodContentEl.appendChild(mealYoutubeEl);

    var mealImgEl = document.createElement("div");
    mealImgEl.appendChild(document.createElement('img')).src=mealImgURL;
    mealYoutubeEl.appendChild(mealImgEl);
    
    foodDivEl.appendChild(foodBlockEl);
}

var getMeals = function(searchText) {
    if (searchText==='!random') {
        var api_url = MEAL_API_RANDOM;
    } else {
        var api_url = `${MEAL_API_SEARCH}s=${searchText}`;
    }
    fetch(api_url)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayMeals(data,searchText);
            });
        } else {
            console.error("Error: "+response.statusText);
        }
    })
    .catch(function(error) {
        displayModal('Network Error: Could not contact TheMealDB.com')
    });
};
// ------ Form Handler ----------
// Listen for search requests

var mealFormHandler = function(event) {
    event.preventDefault();
    let searchText = mealSearchText.value.trim();
    if (!searchText) {
        displayModal('Please enter a search keyword!');
    }
    getMeals(searchText);
    mealSearchText.value = "";
}

foodInputEl.addEventListener("submit",mealFormHandler);

// ------ Modals -------
// Creates a 'pop-up' message to display error message
// 
const rootEl         = document.documentElement; 
const modalEl        = document.createElement('div');
modalEl.className = 'modal';
modalEl.innerHTML=`<div class="modal-background"></div><div class="modal-content"><div class="box"><p id="modal-error-message"></p></div></div><button class="modal-close is-large" aria-label="close"></button>`;
columnsEl.insertBefore(modalEl,columnsEl.firstChild);

// Display an (error) message to the user
var displayModal = function(message) {
    let modalErrorMessageEl = document.getElementById('modal-error-message');
    modalErrorMessageEl.textContent = message;
    rootEl.classList.add('is-clipped');
    modalEl.classList.add('is-active'); // Activates the overlay
};

function closeModals() {
    let modals = document.querySelectorAll('.modal')
    rootEl.classList.remove('is-clipped');
    modals.forEach(function(elMod) {
        elMod.classList.remove('is-active'); // Removes the overlay
    })
};

const modalCloses = document.querySelectorAll(".modal-close");

// Event listener to close the modal window 
modalCloses.forEach(function (el) {
    el.addEventListener('click', function _listener() {
        closeModals();
    }, false);
});
// Event listener to close the modal window on SEC key
document.addEventListener('keydown', function (event) {
    var e = event || window.event;
    if (e.keyCode === 27) {
      closeModals();
    }
});




// Utility Functions
function randBetween(lower,upper) {
    return Math.floor(Math.random() * (upper - lower) + lower);
}

// addModalEventListeners();

// ----- TEMPORARY ------
function testbenchMeals() {
    //getMeals('taco');
    getMeals('!random');
    // getMeals('asdfawef');// <--- uncomment to get error -Patrick
};

// testbenchMeals(); // For testing - Patrick