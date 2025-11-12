const SearchInput = document.querySelector("#Searchinput");
const SearchBtn = document.querySelector("#btn");
const Error = document.querySelector(".error");
const recipeContainer = document.querySelector(".lists");
const RecipeDetails = document.querySelector(".details");

// const BASE_URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${SearchInput}`;

const SearchRecipe = async () => {
    const SearchTrem = SearchInput.value.trim();
    const BASE_URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${SearchTrem}`;

    if(!SearchTrem) {
        Error.textContent = "Please type a search term";
        return;
    }

    try  {
        Error.textContent = `search for ${SearchTrem}...`;
        recipeContainer.innerHTML = "";

        const respons = await fetch(BASE_URL);
        // console.log("staute =", respons.ok)
        const data = await respons.json();
        // console.log("data is here ...", data);

        if(!data.meals) {
            Error.textContent = `No recipe found for ${SearchTrem} Try another search trem`;
        } else {
            Error.textContent = `search result for ${SearchTrem}`;
             SearchInput.value = "";
            displayRecipes(data.meals.slice(0, 12));
           
        }
    

    } catch (err) {
        console.error("error details =", err);
        Error.textContent = "something went wrong. please try again later.";
    }
}

SearchBtn.addEventListener("click", SearchRecipe);

const displayRecipes = (meals) => {
    recipeContainer.innerHTML = "";
    meals.forEach((mel) => {
        // console.log("mel =", mel)
        const div = document.createElement("div");
        div.classList.add("recipe");
        div.innerHTML = `<img src="${mel.strMealThumb}" alt="${mel.strMeal}">
                        <h3> ${mel.strMeal}</h3> 
                        <div class="mel-cat-btn">
                       ${mel.strCategory ? `<div class="meal-category">${mel.strCategory}</div>` : ""}
                       <button onclick="viewRecipe('${mel.idMeal}')"> View Recipe</button> </div>`;
        // console.log("mel =", mel);
        recipeContainer.appendChild(div);
    });
}

const viewRecipe = async (id) => {
  
    try {  
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();
      RecipeDetails.innerHTML = "";

    if(data.meals || data.meals[0]) {
        // RecipeDetails.innerHTML = `<p> no recipe found  for this id</p>`;
        // return;
    

    const mel = data.meals[0];

    const ingredients = [];
    for(let i = 1; i <= 20; i++) {
        if(mel[`strIngredient${i}`] && mel[`strIngredient${i}`].trim() !== "") {
            ingredients.push({ingredient: mel[`strIngredient${i}`],
            measure: mel[`strMeasure${i}`]
        });
        }
    }

    console.log("array =", ingredients);

    console.log("meals =", mel);
    // RecipeDetails.innerText = mel.strMeal;2
    RecipeDetails.innerHTML = "";

    RecipeDetails.classList.add("Recipe-details");
    RecipeDetails.innerHTML = `<img src="${mel.strMealThumb}" width="300">
                                <h2>${mel.strMeal}</h2>
                                ${mel.strCategory ? `<div class="meal-category">${mel.strCategory}</div>` : ""}
                                <span>Instructions</span>
                               <p>${mel.strInstructions}</p>
                               <p id="Ingredient">Ingredients</p>
                               <label>
                               <divi class="ingredient-div">
                               ${ingredients.map((item) => `  
                               <p><i class="fas fa-check-circle"></i> ${item.measure}</p> `).join("")}
                             ${mel.strYoutube ? `
                                <a href="${mel.strYoutube}" target="_blank" class="youtube-link">
                                <i class="fab fa-youtube"></i> Watch Video </a> ` : "" }</divi></label>`;
                               }

    } catch (err) {
        console.error("err =", err);
        RecipeDetails.innerHTML = `<p>somthings wrongs no meals</p>`;
    }

}


