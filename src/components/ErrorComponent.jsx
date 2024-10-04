import React from "react";

const ErrorComponent = ({ message, type }) => {
	const getStyle = () => {
		switch (type) {
			case "error":
				return { color: "red", backgroundColor: "#ffe5e5", padding: "10px", borderRadius: "5px" };
			case "warning":
				return { color: "#856404", backgroundColor: "#fff3cd", padding: "10px", borderRadius: "5px" };
			case "info":
				return { color: "#004085", backgroundColor: "#cce5ff", padding: "10px", borderRadius: "5px" };
			default:
				return {};
		}
	};

	return <div style={getStyle()}>{message}</div>;
};

export default ErrorComponent;
