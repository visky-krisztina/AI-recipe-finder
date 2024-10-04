import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import ErrorComponent from "../components/ErrorComponent";

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [recipes, setRecipes] = useState([]);
	const [favorites, setFavorites] = useState(() => {
		const savedFavorites = localStorage.getItem("favorites");
		return savedFavorites ? JSON.parse(savedFavorites) : [];
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Save favorites to localStorage
	useEffect(() => {
		localStorage.setItem("favorites", JSON.stringify(favorites));
	}, [favorites]);

	const isValidSearchTerm = (term) => {
		// Allow only letters, numbers, and spaces, reject special characters like /* and others
		const regex = /^[a-zA-Z0-9\s]+$/;
		return regex.test(term);
	};

	const fetchRecipes = async (term) => {
		// Trim the term and check if it's valid
		if (!term.trim()) {
			setError({
				message: "Search term cannot be empty.",
				type: "error",
			});
			return;
		}
		if (!isValidSearchTerm(term)) {
			setError({
				message: "Invalid search term. Only letters and numbers are allowed.",
				type: "error",
			});
			setRecipes([]);
			return;
		}

		setLoading(true);
		const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
		const options = {
			method: "POST",
			url: "https://api.openai.com/v1/chat/completions",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			data: {
				model: "gpt-4o-mini",
				messages: [
					{
						role: "user",
						content: `Give me 5 recipe suggestions for ${term}, the output should be in this order and have these keywords: recipe title, cooking time, ingredients, instructions.`,
					},
				],
				max_tokens: 1500,
			},
		};

		try {
			const response = await axios.request(options);
			const generatedText = response.data.choices[0]?.message?.content;

			if (!generatedText) {
				setError({
					message: "No generated text found. Please try again by hitting enter again :)",
					type: "error",
				});
				setLoading(false);
				setRecipes([]);
				return;
			}

			const processedRecipes = parseRecipes(generatedText);

			if (processedRecipes.length > 0) {
				setRecipes(processedRecipes);
				setError(null);
			} else {
				setError({
					message: "Something went wrong, just hit the enter to search the term again :)",
					type: "info",
				});
				setRecipes([]);
			}
		} catch (error) {
			if (error.response && error.response.status === 429) {
				setError({
					message: "API limit reached. Please try again later.",
					type: "error",
				});
			} else {
				setError({
					message: "Error fetching recipes. Please check your internet connection or your API key and try again later.",
					type: "error",
				});
			}
			setRecipes([]);
		} finally {
			setLoading(false);
		}
	};

	const parseRecipes = (text) => {
		// My logic for removing unwanted characters
		// Step 1: Remove unwanted characters (*, newlines) and trim extra spaces, but keep hyphens for ingredients
		const cleanedText = text
			.replace(/\*/g, "") // Remove asterisks
			.replace(/\s*\n\s*/g, " ") // Replace newlines with spaces
			.trim();

		// Step 2: Remove everything before the first recipe (### 1.)
		const startOfRecipes = cleanedText.indexOf("### 1.");
		if (startOfRecipes === -1) {
			setError({
				message: "No recipes found in the generated text.",
				type: "info",
			});
			return []; // Return empty array if no recipes found
		}
		let recipeText = cleanedText.slice(startOfRecipes); // Keep only the text starting from ### 1.
		// Step 2b: Remove unwanted sentences like "Enjoy!" or "Feel free..." from the last recipe
		recipeText = recipeText.replace(/(Enjoy!|Feel free[^.]*\.)/g, "").trim();

		// Step 3: Split the text into recipe blocks using the pattern ### Number (e.g., ### 1., ### 2.)
		const recipeBlocks = recipeText.split(/###\s*\d+\.\s*/).filter(Boolean);

		// Step 4: Parse each recipe block to extract the name, cooking time, ingredients, and instructions
		return recipeBlocks.map((block) => {
			// Remove leading numbers (e.g., "3. ") and any leftover "###" from the name
			const nameMatch = block.match(/^\s*(.*?)(?=\s*Cooking Time:)/);
			const name = nameMatch ? nameMatch[1].trim() : "Unknown Recipe";

			const cookingTimeMatch = block.match(/Cooking Time:\s*(.*?)(?=\s*Ingredients:)/);
			const cookingTime = cookingTimeMatch ? cookingTimeMatch[1].trim() : "N/A";

			// Extract ingredients, keeping the hyphens intact for bulleted list
			const ingredientsMatch = block.match(/Ingredients:\s*(.*?)(?=\s*Instructions:)/);
			const ingredients = ingredientsMatch ? ingredientsMatch[1].trim() : "N/A";

			const instructionsMatch = block.match(/Instructions:\s*(.*)/);
			const instructions = instructionsMatch ? instructionsMatch[1].trim() : "N/A";

			// Remove hyphens from name, cookingTime, and instructions, but keep hyphens in ingredients
			// Sometimes there still appear after those
			const cleanedName = name.replace(/-/g, "").trim();
			const id = name;
			const cleanedCookingTime = cookingTime.replace(/-/g, "").trim();
			const cleanedInstructions = instructions.replace(/-/g, "").trim();

			return {
				id,
				name: cleanedName,
				cookingTime: cleanedCookingTime,
				ingredients,
				instructions: cleanedInstructions,
			};
		});
	};

	const addToFavorites = (recipe) => {
		if (favorites.some((fav) => fav.id === recipe.id)) {
			const updatedFavorites = favorites.filter((fav) => fav.id !== recipe.id);
			setFavorites(updatedFavorites);
		} else {
			const updatedFavorites = [...favorites, recipe];
			setFavorites(updatedFavorites);
		}
	};
	const removeFromFavorites = (recipeToRemove) => {
		setFavorites((prevFavorites) => prevFavorites.filter((recipe) => recipe.name !== recipeToRemove.name));
	};

	return (
		<RecipeContext.Provider
			value={{
				searchTerm,
				setSearchTerm,
				recipes,
				fetchRecipes,
				favorites,
				addToFavorites,
				removeFromFavorites,
				setRecipes,
				loading,
				setError,
			}}
		>
			{error && <ErrorComponent message={error.message} type={error.type} />}
			{children}
		</RecipeContext.Provider>
	);
};
