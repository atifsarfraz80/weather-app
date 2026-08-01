import "./style.css";
import { loadDetails } from "./loadDetails.js";

const appContainer = document.getElementById("app");
const searchForm = document.getElementById("search-form");
const weatherDashboard = document.getElementById("weather-dashboard");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (appContainer.classList.contains("initial-state")) {
    appContainer.classList.remove("initial-state");
    appContainer.classList.add("searched-state");
    weatherDashboard.classList.remove("hidden");
  }

  // 2. Call your Visual Crossing API function here...
  // fetchWeatherData(locationInput.value);
  loadDetails(document.querySelector("#search-input").value);
});
