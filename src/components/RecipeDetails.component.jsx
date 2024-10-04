import React, { useContext } from "react";
import { RecipeContext } from "../context/RecipeContext.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../styles/recipeDetail.styles.css";
import no_image from "../assets/no-image.png";

const RecipeDetails = () => {
	const { name } = useParams();
	const { recipes, favorites, addToFavorites, removeFromFavorites } = useContext(RecipeContext);
	const navigate = useNavigate();

	// Find the recipe by name in both suggested recipes and favorites
	const recipe = [...recipes, ...favorites].find((recipe) => recipe.name === decodeURIComponent(name));

	if (!recipe) {
		return <p>Recipe not found.</p>;
	}

	// Check if the recipe is in favorites
	const isFavorited = favorites.some((fav) => fav.name === recipe.name);

	const handleFavoriteToggle = () => {
		if (isFavorited) {
			removeFromFavorites(recipe);
			navigate("/");
		} else {
			addToFavorites(recipe);
		}
	};

	return (
		<div className='recipe-detail-wrapper'>
			<div className='recipe-detail-container'>
				<div className='recipe-left'>
					<img src={no_image} alt={recipe.name} className='recipe-detail-image' />
					<div className='recipe-detail-main'>
						<div className='recipe-detail-main-text'>
							<h2>{recipe.name}</h2>
							<p>{recipe.cookingTime}</p>
						</div>
						<button onClick={handleFavoriteToggle} className='favorite-btn'>
							{isFavorited ? <FaHeart className='favorited-icon' /> : <FaRegHeart className='not-favorited-icon' />}
						</button>
					</div>
				</div>

				<div className='recipe-right'>
					<div className='ingredients'>
						<h3>Ingredients:</h3>
						<ul>
							{recipe.ingredients
								.split(/\s*-\s+/) // Split on hyphen with possible leading/trailing spaces
								.map((ingredient) => ingredient.trim())
								.filter((ingredient) => ingredient) // Filter out any empty strings
								.map((ingredient, index) => (
									<li key={index}>{ingredient}</li>
								))}
						</ul>
					</div>
					<div className='instructions'>
						<h3>Instructions:</h3>
						{recipe.instructions
							.split(/(?=\d+\.\s)/) // Split on digits followed by a dot and a space, keeping the delimiter
							.map((instruction, index) => (
								<p key={index}>{instruction.trim().replace(/---$/, "")}</p> // Trim spaces and remove trailing ---
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RecipeDetails;
