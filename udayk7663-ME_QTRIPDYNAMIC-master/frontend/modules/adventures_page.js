import config from "../conf/index.js";

/**
 * Extracts city from query parameter and returns it
 */
function getCityFromURL(search) {
  const params = new URLSearchParams(search);
  return params.get("city");
}

/**
 * Fetches list of adventures for a given city from backend
 */
async function fetchAdventures(city) {
  try {
    const res = await fetch(`${config.backendEndpoint}/adventures?city=${city}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching adventures:", err);
    return null;
  }
}

/**
 * Adds adventure cards to the DOM
 */
function addAdventureToDOM(adventures) {
  const dataContainer = document.getElementById("data");
  dataContainer.innerHTML = "";

  adventures.forEach((adventure) => {
    const div = document.createElement("div");
    div.className = "col-6 col-lg-3 mb-4";

    div.innerHTML = `
      <a href="detail/?adventure=${adventure.id}" id="${adventure.id}">
        <div class="activity-card">
          <div class="category-banner">${adventure.category}</div>
          <img src="${adventure.image}" alt="${adventure.name}" />
          <div class="d-flex justify-content-between align-items-center p-2">
            <h5>${adventure.name}</h5>
            <p>₹${adventure.costPerHead}</p>
          </div>
          <div class="d-flex justify-content-between align-items-center px-2 pb-2">
            <p>Duration</p>
            <p>${adventure.duration} Hours</p>
          </div>
        </div>
      </a>
    `;

    dataContainer.appendChild(div);
  });
}

/**
 * Filter adventures by duration
 */
function filterByDuration(list, low, high) {
  return list.filter((adv) => adv.duration >= low && adv.duration <= high);
}

/**
 * Filter adventures by category
 */
function filterByCategory(list, categoryList) {
  if (categoryList.length === 0) return list;
  return list.filter((adv) => categoryList.includes(adv.category));
}

/**
 * Combines both filters
 */
function filterFunction(list, filters) {
  let filteredList = list;

  if (filters.duration) {
    const [low, high] = filters.duration.split("-").map(Number);
    filteredList = filterByDuration(filteredList, low, high);
  }

  if (filters.category && filters.category.length > 0) {
    filteredList = filterByCategory(filteredList, filters.category);
  }

  return filteredList;
}

/**
 * Save filters to local storage
 */
function saveFiltersToLocalStorage(filters) {
  localStorage.setItem("filters", JSON.stringify(filters));
  return true;
}

/**
 * Get filters from local storage
 */
function getFiltersFromLocalStorage() {
  const saved = localStorage.getItem("filters");
  return saved ? JSON.parse(saved) : null;
}

/**
 * Update the DOM with filter pills
 */
function generateFilterPillsAndUpdateDOM(filters) {
  const categoryListContainer = document.getElementById("category-list");
  categoryListContainer.innerHTML = "";

  filters.category.forEach((cat) => {
    const pill = document.createElement("div");
    pill.className = "category-filter";
    pill.innerText = cat;
    categoryListContainer.appendChild(pill);
  });

  // Update duration dropdown if any
  const durationSelect = document.getElementById("duration-select");
  if (filters.duration && durationSelect) {
    durationSelect.value = filters.duration;
  }
}

// Export all
export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
};
