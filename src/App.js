import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { RecipeProvider } from "./context/RecipeContext"; // New context for recipes
import SearchBar from "./components/SearchBar.component";
import RecipeList from "./components/RecipeList.component";
import RecipeDetails from "./components/RecipeDetails.component";
import "./styles/styles.css";

const App = () => {
	return (
		<RecipeProvider>
			<Router>
				<div className='App'>
					<Routes>
						<Route
							path='/'
							element={
								<>
									<SearchBar />
									<RecipeList />
								</>
							}
						/>
						<Route path='/recipe/:name' element={<RecipeDetails />} />
					</Routes>
				</div>
			</Router>
		</RecipeProvider>
	);
};

export default App;
