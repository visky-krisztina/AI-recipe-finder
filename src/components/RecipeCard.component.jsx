import React, { useContext } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { RecipeContext } from "../context/RecipeContext.jsx";
import "../styles/recipeCard.styles.css";
import no_image from "../assets/no-image.png";

const RecipeCard = ({ recipe }) => {
	const { favorites, addToFavorites, removeFromFavorites } = useContext(RecipeContext);
	const { name, cookingTime } = recipe;
	const isFavorited = favorites.some((fav) => fav.name === recipe.name);

	const handleFavoriteToggle = () => {
		if (isFavorited) {
			removeFromFavorites(recipe);
		} else {
			addToFavorites(recipe);
		}
	};

	return (
		<div className='recipe-card'>
			<img src={no_image} alt={name} className='recipe-image' />

			<div className='recipe-detail'>
				<Link to={`/recipe/${encodeURIComponent(name)}`} className='recipe-title'>
					{name}
				</Link>
				<p className='recipe-cooking-time'> {cookingTime}</p>
			</div>
			<button onClick={handleFavoriteToggle} className='favorite-btn'>
				{isFavorited ? <FaHeart className='favorited-icon' /> : <FaRegHeart className='not-favorited-icon' />}
			</button>
		</div>
	);
};

export default RecipeCard;
