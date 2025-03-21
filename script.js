const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");
const closeBtn = document.querySelector(".closeBtn");
const RecipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeDetails = document.querySelector(".recipe-details");

// Function to fetch recipes
const fetchRecipe = async (query) => {
  try {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";

    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const data = await response.json();

    console.log(data);
    recipeContainer.innerHTML = ""; // Clear previous results

    data.meals.forEach((meal) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");

      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
        <h2>${meal.strMeal}</h2>
        <p><strong>${meal.strArea}</strong> dish</p>
        <p>Belongs from <strong>${meal.strCategory}</strong> category</p>
      `;

      const button = document.createElement("button");
      button.classList.add("recipe-btn");
      button.innerText = "View Recipe";

      button.addEventListener("click", () => RecipePopup(meal));

      recipeDiv.appendChild(button);
      recipeContainer.appendChild(recipeDiv);
    });
  } catch (error) {
    recipeContainer.innerHTML = "<h2>Error in fetching recipes...</h2>";
  }
};

// Function to fetch ingredients
const fetchIngredients = (meal) => {
  let IngredientsList = "";

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      IngredientsList += `<li><strong>${measure}</strong> ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return IngredientsList;
};

// Function to show recipe details popup
const RecipePopup = (meal) => {
  recipeDetails.style.display = "block"; // Show the popup

  RecipeDetailsContent.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <h3 class="ingredient-heading">Ingredients:</h3>
    <ul>${fetchIngredients(meal)}</ul>
    <h3 class="instructionsHeading">Instructions: </h3>
    <p class="ins">${meal.strInstructions}</p>
  `;

  closeBtn.addEventListener("click", closeRecipePopup);
};

const closeRecipePopup = () => {
  recipeDetails.style.display = "none";
};

// Event listener for search button
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const searchInput = searchBox.value.trim();
  if (!searchInput) {
    recipeContainer.innerHTML =
      "<h2>Please enter recipe name in search box...</h2>";
    return;
  }

  fetchRecipe(searchInput);
});

