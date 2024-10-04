import React, { useContext } from "react";
import { RecipeContext } from "../context/RecipeContext";
import RecipeCard from "./RecipeCard.component";
import "../styles/recipeList.styles.css";

const RecipeList = () => {
	const { searchTerm, recipes, favorites, addToFavorites, fetchRecipes } = useContext(RecipeContext);

	// Function to handle fetching new recipes when "I don't like these" is clicked
	const handleFetchNewRecipes = () => {
		fetchRecipes(searchTerm);
	};

	return (
		<div className='recipe-list'>
			<h2>{recipes.length > 0 ? "Suggested Recipes" : "Favorites"}</h2>
			<div className='recipe-list-items'>
				{recipes.length > 0 ? (
					recipes.map((recipe, index) => (
						<div key={index} className='recipe-item'>
							<RecipeCard recipe={recipe} favorites={favorites} addToFavorites={addToFavorites} />
						</div>
					))
				) : favorites.length > 0 ? (
					favorites.map((favorite, index) => (
						<div key={index} className='recipe-item'>
							<RecipeCard recipe={favorite} favorites={favorites} addToFavorites={addToFavorites} />
						</div>
					))
				) : (
					<p>No favorite recipes yet.</p>
				)}
			</div>
			{recipes.length > 0 && (
				<button className='new-recipe-btn' onClick={handleFetchNewRecipes}>
					I don't like these
				</button>
			)}
		</div>
	);
};

export default RecipeList;
