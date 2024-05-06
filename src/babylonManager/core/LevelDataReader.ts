import { GameData } from "../../interfaces/gameData.interface";

// Function to fetch the JSON data and convert it to a TypeScript object
export async function fetchGameData(): Promise<GameData> {
  try {
    // Make a GET request to fetch the JSON file
    const response = await fetch("./src/assets/gameData.json");

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Failed to fetch JSON data");
    }

    // Parse the JSON data into a JavaScript object
    const jsonData = await response.json();

    // Return the parsed data as a TypeScript object
    return jsonData as GameData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
