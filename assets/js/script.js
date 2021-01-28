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
var storeMeal = function(target) {
    let idMeal = target.value;
    localStorage.setItem('favorite-meal', idMeal);
    let favMealBtn = document.querySelector('.btn-favorite');
    favMealBtn.classList.add('is-primary');
}

var recallFavorites = function(event) {
    console.log(event);
    if (!localStorage.getItem('favorite-meal')) {
        getMeals('!random');
        return ;
    } else {
        getMealByID(localStorage.getItem('favorite-meal'));
    }
};

var favoriteHandler = function(event) {
    console.log(event.currentTarget);
    console.log(event.currentTarget.value);
    if (localStorage.getItem('favorite-meal') === event.currentTarget.value) {
        console.log("Remove Favorite")
        event.currentTarget.classList.remove('is-primary');
        localStorage.removeItem('favorite-meal');
        // localStorage.getItem
    } else {
        storeMeal(event.currentTarget)
    }
}
var displayMeal = function(data,searchTerm) {
    // console.log(data);
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
    var idMeal = meal.idMeal;
    var mealImgURL = meal.strMealThumb;
    var mealName = meal.strMeal;
    var mealYoutubeURL = meal.strYoutube;
    var mealCategory = meal.strCategory;
    
    // Create DOM elements
    let foodBlockEl = document.createElement('div');
    foodBlockEl.className = "block";
    foodDivEl.appendChild(foodBlockEl);

    var foodContentEl = document.createElement('div');
    foodContentEl.className = 'box';
    foodContentEl.innerHTML = `<span><a href="#0" class="subtitle">${mealCategory}</a></span><h3 class="title">${mealName}</h3>`

    foodBlockEl.appendChild(foodContentEl);
    let favoriteBtn = document.createElement('button');
    
    favoriteBtn.value = idMeal;
    favoriteBtn.setAttribute('data-favorite', idMeal);
    favoriteBtn.name = "meal-favorite";
    favoriteBtn.textContent = "";
    favoriteBtn.type = "button";
    favoriteBtn.className = "button btn-favorite";
    
    favoriteBtn.addEventListener('click',favoriteHandler);

    let favoriteIcon = document.createElement('span')
    favoriteIcon.className = "icon"

    favoriteIcon.appendChild(document.createElement('i')).className="far fa-bookmark";
    favoriteBtn.appendChild(favoriteIcon);
    

    //innerHTML= `<i class="far fa-bookmark"></i>`
    if (idMeal === localStorage.getItem('favorite-meal')) {
        favoriteBtn.classList.add('is-primary')
    }
    var mealYoutubeEl = document.createElement("a");
    mealYoutubeEl.href=mealYoutubeURL;
    foodContentEl.appendChild(mealYoutubeEl);

    var mealImgEl = document.createElement("div");
    mealImgEl.appendChild(document.createElement('img')).src=mealImgURL;
    foodContentEl.appendChild(favoriteBtn);
    mealYoutubeEl.appendChild(mealImgEl);

}
var getMealByID = function(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayMeal(data);
            });
        } else {
            console.error("Error: "+response.statusText);
        }
    })
    .catch(function(error) {
        displayModal('Network Error: Could not contact TheMealDB.com');
        return;
    });
};

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
                displayMeal(data,searchText);
            });
        } else {
            console.error("Error: "+response.statusText);
        }
    })
    .catch(function(error) {
        displayModal('Network Error: Could not contact TheMealDB.com');
        return;
    });
};
// ------ Form Handler ----------
// Listen for search requests

var mealFormHandler = function(event) {
    event.preventDefault();
    let searchText = mealSearchText.value.trim();
    if (!searchText) {
        displayModal('Please enter a search keyword!');
        return;
    } else {
        getMeals(searchText);
    }
}

foodInputEl.addEventListener("submit", mealFormHandler);

// ------ Modals -------
// Creates a 'pop-up' message to display error message
// 

const rootEl         = document.documentElement; 
const modalEl        = document.createElement('div');
const modalCloses    = document.querySelectorAll(".modal-close");

modalEl.className = 'modal';
modalEl.setAttribute('role','dialog');
modalEl.innerHTML=`<div class="modal-background"></div><div class="modal-content"><div class="box"><p id="modal-error-message"></p></div></div><button class="modal-close is-large" aria-label="close"></button>`;
columnsEl.insertBefore(modalEl,columnsEl.firstChild);

function handleKeypress(e) {
    if (e.keyCode === 27) {
        closeModals();
    }
    e.preventDefault();
}
// Display an (error) message to the user
// Event listener to close the modal window on ESC key
function displayModal(message) {
    let modalErrorMessageEl = document.getElementById('modal-error-message');
    modalErrorMessageEl.textContent = message;
    rootEl.classList.add('is-clipped');
    modalEl.classList.add('is-active'); // Activates the overlay
    document.addEventListener('keydown', handleKeypress);
    }

// Close the modal window
function closeModals(){
    let modals = document.querySelectorAll('.modal')
    rootEl.classList.remove('is-clipped');
    modals.forEach(function(elMod) {
        elMod.classList.remove('is-active'); // Removes the overlay
    });
    document.removeEventListener('keydown',handleKeypress);

};

// Event listener to close the modal window 
document.querySelector('.modal-close').addEventListener('click', function (event) {
    closeModals();
})

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
window.addEventListener('DOMContentLoaded', recallFavorites)
//DRINKS SCRIPTS
const DRINK_API_RANDOM = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
const DRINK_API_SEARCH = 'https://www.thecocktaildb.com/api/json/v1/1/search.php';
const DRINK_API_NONALC = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic';

// Main Body Elements
const drinkDivEl = document.querySelector("#drink-result");

var getDrinks = function(queryStr){
	if (!queryStr) return;
    if (queryStr==='!random') {
        var api_url = DRINK_API_RANDOM;
    }else if(queryStr=='Non_Alcoholic'){
		var api_url = DRINK_API_NONALC;
	} else {
        var api_url = `${DRINK_API_SEARCH}?s=${queryStr}`;
    }
    fetch(api_url)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
            displayDrinks(data,queryStr);
          });
          } else {
            console.error("Error: "+response.statusText);
          }
        })
        .catch(function(error) {
            displayModal('Network Error: Could not contact TheCocktailDB.com')
            // return;
    })
}

var displayDrinks = function(data,searchTerm) {
    console.log(data);
    if (!data.drinks) {
        displayModal(`Sorry, no results for '${searchTerm}'`);
        return;
    }
    drinkDivEl.innerHTML = ""; // Clear last drink display
	
	// Pick a random drink from the search results
    let randIndex=randBetween(0,data.drinks.length);
    let drink = data.drinks[randIndex];
    console.log(drink);
	
	
    // Get drink data
    var drinkImgURL = drink.strDrinkThumb;
    var drinkName = drink.strDrink;
    var drinkTags = drink.strTags;
    var drinkCategory = drink.strCategory;
    if (searchTerm=='Non_Alcoholic'){
        drinkCategory= "Non-Alcoholic";
    }
    
    // Create DOM elements
    let drinkBlockEl = document.createElement('div');
    
    drinkBlockEl.className = "block"
    
    var drinkContentEl = document.createElement('div');
    drinkContentEl.className = "box";
    drinkContentEl.innerHTML = `<span><a href="#0" class="subtitle">${drinkCategory}</a></span><h3 class="title">${drinkName}</h3>`
    
    var drinkImgEl = document.createElement("div");
    drinkImgEl.appendChild(document.createElement('img')).src=drinkImgURL;
    drinkContentEl.appendChild(drinkImgEl);
    drinkBlockEl.appendChild(drinkContentEl);
    drinkDivEl.appendChild(drinkBlockEl);
}

// ----- Initial drink ------
function testbenchDrinks() {
    getDrinks('!random');
};

testbenchDrinks();
