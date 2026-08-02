import "./style.css";
import { loadDetails } from "./loadDetails.js";

const appContainer = document.getElementById("app");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  if (appContainer.classList.contains("initial-state")) {
    appContainer.classList.remove("initial-state");
    appContainer.classList.add("searched-state");
  }

  loadDetails(query);
});