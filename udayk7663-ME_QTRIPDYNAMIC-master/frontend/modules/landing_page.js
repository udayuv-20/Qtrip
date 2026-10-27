import config from "../conf/index.js";

// Fetch the cities list from backend API
async function fetchCities() {
  try {
    const response = await fetch(`${config.backendEndpoint}/cities`);
    const cities = await response.json();
    return cities;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return null;
  }
}

// Add city details dynamically to the DOM
function addCityToDOM(id, cityName, description, imageUrl) {
  // Get the parent div
  const dataContainer = document.getElementById("data");

  // Create the outer city div
  const cityDiv = document.createElement("div");
  cityDiv.className = "col-6 col-lg-3 mb-4";

  // Create the anchor link
  const cityLink = document.createElement("a");
  cityLink.id = id; // Required by tests
  cityLink.href = `pages/adventures/?city=${id}`;

  // Add the inner HTML for the tile
  cityLink.innerHTML = `
    <div class="tile">
      <img src="${imageUrl}" alt="${cityName}" />
      <div class="tile-text text-center">
        <h5>${cityName}</h5>
        <p>${description}</p>
      </div>
    </div>
  `;

  // Append to DOM
  cityDiv.appendChild(cityLink);
  dataContainer.appendChild(cityDiv);
}

export { fetchCities, addCityToDOM };
