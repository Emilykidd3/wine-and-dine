// MEAL API ENDPOINTS 
const MEAL_API_RANDOM  = 'https://www.themealdb.com/api/json/v1/1/random.php';
const MEAL_API_SEARCH = 'https://www.themealdb.com/api/json/v1/1/search.php?';



// Main Body Elements
const foodDivEl       = document.querySelector("#food-result");
const columnsEl       = document.querySelector(".columns");

// Display meal summary from fetch response data
// 
var displayMeals = function(data,searchTerm) {
    console.log(data);
    if (!data.meals) {
        displayModal(`Sorry, no results for '${searchTerm}'`);
        return;
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
    
    foodBlockEl.className = "columns is-mobile mt-2"
    
    var foodContentEl = document.createElement('div');
    foodContentEl.className = 'column is-half';
    foodContentEl.innerHTML = `<span><a href="#0" class="subtitle">${mealCategory}</a></span><h3 class="title">${mealName}</h3>`
    
    var mealImgEl = document.createElement("div");
    mealImgEl.appendChild(document.createElement('img')).src=mealImgURL;
    foodContentEl.appendChild(mealImgEl);
    foodBlockEl.appendChild(foodContentEl);
    foodDivEl.appendChild(foodBlockEl);
}

var getMeals = function(queryStr) {
    if (!queryStr) return;
    if (queryStr==='!random') {
        var api_url = MEAL_API_RANDOM;
    } else {
        var api_url = `${MEAL_API_SEARCH}s=${queryStr}`;
    }
    fetch(api_url)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
            displayMeals(data,queryStr);
          });
          } else {
            console.error("Error: "+response.statusText);
          }
        })
        .catch(function(error) {
            displayModal('Network Error: Could not contact TheMealDB.com')
            // return;
    })
};




// Utility Functions
function randBetween(lower,upper) {
    return Math.floor(Math.random() * (upper - lower) + lower);
}


// ------ Modals -------
// Creates a 'pop-up' message to display error message
// 
const modalEl = document.createElement('div'); 
modalEl.className = 'modal';
modalEl.innerHTML=`<div class="modal-background"></div><div class="modal-content"><div class="box"><p id="modal-error-message"></p></div></div><button class="modal-close is-large" aria-label="close"></button>`;
columnsEl.prepend(modalEl);

// Display an (error) message to the user
var displayModal = function(message){
    modalErrorMessageEl = document.getElementById('modal-error-message');
    modalErrorMessageEl.textContent = message;
    modalEl.classList.add('is-active'); // Activates the overlay
    addModalEventListeners();
}
// Event listener to close the modal window
function addModalEventListeners () {
    const modalCloses = document.querySelectorAll(".modal-close");
    modalCloses.forEach(function (el) {
        el.addEventListener('click', function _listener() {
            modalEl.classList.remove('is-active'); // Removes the overlay
            el.removeEventListener("click", _listener, true);
        }, true);
        });
};

// ----- TEMPORARY ------
function testbenchMeals() {
    //getMeals('taco');
    getMeals('!random');
    // getMeals('asdfawef');// <--- uncomment to get error -Patrick
};

testbenchMeals(); // For testing - Patrick