import React, { useContext } from "react";
import { RecipeContext } from "../context/RecipeContext";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/searchBar.styles.css";

const SearchBar = () => {
	const { searchTerm, setSearchTerm, setRecipes, fetchRecipes, loading } = useContext(RecipeContext);
	const navigate = useNavigate();

	const handleInputChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const clearSearch = () => {
		setSearchTerm("");
		setRecipes([]);
		navigate("/"); // Navigate back to the homepage to show the Favorites
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter" && !loading) {
			// Ensure fetch is only triggered if not loading
			fetchRecipes(searchTerm);
		}
	};

	return (
		<div className='search-bar'>
			<input
				type='text'
				placeholder='What do you feel like eating?'
				value={searchTerm}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				className='search-input'
				autoComplete='off'
			/>
			{searchTerm ? (
				<button className='icon clear-btn' onClick={clearSearch}>
					<FaTimes />
				</button>
			) : (
				<FaSearch
					className='icon search-icon'
					onClick={() => {
						if (searchTerm.trim() && !loading) {
							fetchRecipes(searchTerm);
						}
					}}
					style={{
						cursor: searchTerm.trim() && !loading ? "pointer" : "not-allowed",
						color: searchTerm.trim() && !loading ? "black" : "gray",
					}}
				/>
			)}
			{loading && <div className='loading-spinner'>Loading...</div>}
		</div>
	);
};

export default SearchBar;
