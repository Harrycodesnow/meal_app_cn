if (localStorage.getItem("favouritesList") == null) {
  localStorage.setItem("favouritesList", JSON.stringify([]));
}

const fetchMeals = async (url, value) => {
  const response = await fetch(`${url + value}`);
  const meals = await response.json();
  return meals;
};

function showMealList() {
  let inputValue = document.getElementById("my-search").value;
  let favList = JSON.parse(localStorage.getItem("favouritesList"));
  let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  let html = ``;
  let meals = fetchMeals(url, inputValue);

  meals.then((data) => {
    if (data.meals) {
      data.meals.forEach((meal) => {
        let isFavorite = false;
        for (let i = 0; i < favList.length; i++) {
          if (favList[i] == meal.idMeal) {
            isFavorite = true;
          }
        }

        if (isFavorite) {
          html += `
                    <div id="card" class="card mb-3" style="width: 20rem;">
                      <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
                      <div class="card-body">
                        <h5 class="card-title">${meal.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${meal.idMeal})">More Details</button>
                            <button id="main${meal.idMeal}" class="btn btn-outline-light active" onclick="addRemoveFromFavorites(${meal.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                      </div>
                    </div>
                `;
        } else {
          html += `
                   <div id="card" class="card mb-3" style="width: 20rem;">
                     <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
                     <div class="card-body">
                        <h5 class="card-title">${meal.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${meal.idMeal})">More Details</button>
                            <button id="main${meal.idMeal}" class="btn btn-outline-light" onclick="addRemoveFromFavorites(${meal.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                     </div>
                  </div>
            `;
        }
      });
    } else {
      html += `
          <div class="page-wrap d-flex flex-row align-items-center">
           <div class="container">
            <div class "row justify-content-center">
                <div class="col-md-12 text-center">
                    <span class="display-1 d-block">Not Found</span>
                    <div class="mb-4 lead">
                        The meal you are looking for was not found.
                    </div>
                </div>
            </div>
          </div>
         </div>
        `;
    }

    document.getElementById("main-card").innerHTML = html;
  });
}

async function showMealDetails(id) {
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = ``;
  await fetchMeals(url, id).then((data) => {
    html += `
          <div id="meal-details" class="mb-5">
            <div id="meal-header" class="d-flex justify-content-around flex-wrap">
              <div id="meal-thumbnail">
                <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="" srcset="">
              </div>
              <div id="details">
                <h3>${data.meals[0].strMeal}</h3>
                <h6>Category : ${data.meals[0].strCategory}</h6>
                <h6>Area : ${data.meals[0].strArea}</h6>
              </div>
            </div>
            <div id="meal-instruction" class="mt-3">
              <h5 class="text-center">Instruction :</h5>
              <p>${data.meals[0].strInstructions}</p>
            </div>
            <div class="text-center">
              <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
            </div>
          </div>
        `;
  });
  document.getElementById("main-card").innerHTML = html;
}

async function showFavMealList() {
  let favList = JSON.parse(localStorage.getItem("favouritesList"));
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = ``;
  if (favList.length == 0) {
    html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">Not Found</span>
                            <div class="mb-4 lead">
                                No meal added in your favorites list.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
  } else {
    for (let i = 0; i < favList.length; i++) {
      await fetchMeals(url, favList[i]).then((data) => {
        html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${data.meals[0].strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                            <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveFromFavorites(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
      });
    }
  }
  document.getElementById("favourites-body").innerHTML = html;
}

function addRemoveFromFavorites(id) {
  let favList = JSON.parse(localStorage.getItem("favouritesList"));
  let isPresent = false;
  for (let i = 0; i < favList.length; i++) {
    if (id == favList[i]) {
      isPresent = true;
    }
  }
  if (isPresent) {
    let number = favList.indexOf(id);
    favList.splice(number, 1);
    alert("Your meal removed from your favorites list");
  } else {
    favList.push(id);
    alert("Your meal added to your favorites list");
  }
  localStorage.setItem("favouritesList", JSON.stringify(favList));
  displayMeals();
  showFavMealList();
}

document.getElementById("search-button").addEventListener("click", showMealList);
