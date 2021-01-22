const foodDivEl       = document.querySelector("#food");
const columnsEl       = document.querySelector(".columns");
const contentEl       = document.querySelectorAll(".column")[1];

MEAL_API_URL = 'https://www.themealdb.com/api/json/v1/1/';
MEAL_API_RANDOM  = 'https://www.themealdb.com/api/json/v1/1/random.php';
MEAL_API_SEARCH = 'https://www.themealdb.com/api/json/v1/1/search.php?';

var displayMeals = function(data,search) {
    console.log(data);
    if (!data.meals) {
        modalEl.classList.add('is-active');
        return;
    }
    var randIndex=randBetween(0,data.meals.length);
    let meal = data.meals[randIndex]; 
    var mealImgURL = meal.strMealThumb;
    var mealName = meal.strMeal;
    var mealYoutubeURL = meal.strYoutube;
    var foodContentEl = document.createElement('div');
    foodContentEl.classList = "content is-size-3";
    foodContentEl.textContent=mealName;
    var mealImgEl = document.createElement("figure");
    mealImgEl.classList = "image is-square";
    mealImgEl.innerHTML = `<a href="${mealYoutubeURL}"><img src="${mealImgURL}"></a>`
    foodBlockEl.appendChild(foodContentEl)
    foodBlockEl.appendChild(mealImgEl);

    
}
var getMeals = function(queryStr) {
    if (queryStr==='!random') {
        var api_url = MEAL_API_RANDOM;
    } else {
        var api_url = `${MEAL_API_SEARCH}s=${queryStr}`;
    }
    foodBlockEl.innerHTML = '';
    fetch(api_url).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
            
            displayMeals(data,queryStr);
          });
          } else {
            console.error("Error: "+response.statusText);
          }
        })
        .catch(function(error) {
            modalEl.classList.add('is-active');
            return;
        })
};
// Utility Functions
function randBetween(lower,upper) {
    return Math.floor(Math.random() * (upper - lower) + lower);
}

function testbenchMeals() {
    var modalCloses = document.querySelectorAll(".modal-close");
    modalCloses.forEach(function (el) {
        el.addEventListener('click', function() {
            modalEl.classList.remove('is-active');
        })
    });
    
    //getMeals('!random');
    getMeals('taco');
    //getMeals('asdfawef');
    return "Passed";
};

const foodBlockEl = document.createElement('div');
const modalEl = document.createElement('div');

foodBlockEl.className = 'column is-half';
modalEl.className = 'modal';
modalEl.innerHTML=`<div class="modal-background"></div><div class="modal-content"><div class="box"><p id="modal-error-message">Error</p></div></div><button class="modal-close is-large" aria-label="close"></button>`;
columnsEl.appendChild(modalEl);
contentEl.appendChild(foodBlockEl);
console.log(testbenchMeals());