import { weatherIcons } from "./assets/weather-icons/export.js";

export async function loadDetails(location) {
  const key = "UVNMRABPQ9XF8G9F56E8YA24T";
  const spinner = document.getElementById("loading-spinner");
  const dashboard = document.querySelector("#weather-dashboard");

  try {
    if (spinner) spinner.classList.remove("hidden");
    dashboard.classList.add("hidden");

    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?key=${key}`
    );

    if (!response.ok) {
      throw new Error("Location not found");
    }

    const body = await response.json();
    const address = body.address.toUpperCase();

    const toCelsius = (f) => Math.round((f - 32) * (5 / 9));
    const toFahrenheit = (f) => Math.round(f);

    const forecastDays = body.days.slice(0, 7).map((d, index) => {
      const dayDate = new Date(d.datetime);
      const dayName = index === 0 ? "Today" : dayDate.toLocaleDateString("en-US", { weekday: "long" });
      const shortDayName = index === 0 ? "Today" : dayDate.toLocaleDateString("en-US", { weekday: "short" });
      const dayIcon = weatherIcons[d.icon] || weatherIcons["cloudy"];

      return {
        tempF: Math.round(d.temp),
        tempC: toCelsius(d.temp),
        maxC: toCelsius(d.tempmax),
        minC: toCelsius(d.tempmin),
        maxF: toFahrenheit(d.tempmax),
        minF: toFahrenheit(d.tempmin),
        precipitation: Math.round(d.precipprob ?? d.precip * 100),
        windSpeed: d.windspeed,
        humidity: d.humidity,
        condition: d.conditions,
        description: d.description || body.description,
        date: d.datetime,
        dayName,
        shortDayName,
        icon: dayIcon,
      };
    });

    let selectedDayIndex = 0;
    let isCelsius = true;

    const forecastHTML = forecastDays
      .map(
        (d, i) => `
        <div class="day-card ${i === 0 ? "active" : ""}" data-index="${i}">
          <span class="day-name">${d.shortDayName}</span>
          <img src="${d.icon}" alt="${d.condition}" class="weather-icon small">
          <span class="small-temp" data-max-c="${d.maxC}" data-min-c="${d.minC}" data-max-f="${d.maxF}" data-min-f="${d.minF}">
            ${d.maxC}° <span class="min-temp">${d.minC}°</span>
          </span>
        </div>
      `
      )
      .join("");

    dashboard.innerHTML = `
      <section class="location-bar">
        <div class="location-info">
          <span class="location-icon">📍</span>
          <h2 id="current-location">${address}</h2>
        </div>

        <div class="unit-toggle">
          <button id="unit-c" class="toggle-btn active">°C</button>
          <span class="divider">|</span>
          <button id="unit-f" class="toggle-btn">°F</button>
        </div>
      </section>

      <section class="weather-hero">
        <div class="temp-summary">
          <img id="hero-icon" src="" alt="Weather Icon" class="weather-icon">
          <div class="hero-temp-group">
            <span id="current-temp" class="hero-temp"></span>
            <span class="unit-symbol">°C</span>
          </div>
          <div class="hero-details">
            <p>Precipitation: <span id="precipitation"></span></p>
            <p>Humidity: <span id="humidity"></span></p>
            <p>Wind: <span id="wind-speed"></span></p>
          </div>
        </div>

        <div class="condition-summary">
          <h3 id="app-name-tag">Weather</h3>
          <p id="current-day"></p>
          <p id="current-date"></p>
          <p id="weather-condition" class="condition-text"></p>
        </div>
      </section>

      <section class="forecast">
        ${forecastHTML}
      </section>

      <section class="weather-description-card">
        <h4 class="description-title">Day Summary</h4>
        <p id="weather-description" class="description-text"></p>
      </section>
    `;

    const updateHero = function (dayData) {
      document.querySelector("#hero-icon").src = dayData.icon;
      document.querySelector("#hero-icon").alt = dayData.condition;
      document.querySelector("#current-temp").textContent = isCelsius ? dayData.tempC : dayData.tempF;
      document.querySelector(".unit-symbol").textContent = isCelsius ? "°C" : "°F";
      document.querySelector("#precipitation").textContent = `${dayData.precipitation}%`;
      document.querySelector("#humidity").textContent = `${dayData.humidity}%`;
      document.querySelector("#wind-speed").textContent = `${dayData.windSpeed} km/h`;
      document.querySelector("#current-day").textContent = dayData.dayName;
      document.querySelector("#current-date").textContent = dayData.date;
      document.querySelector("#weather-condition").textContent = dayData.condition;
      document.querySelector("#weather-description").textContent = dayData.description;
    }

    updateHero(forecastDays[0]);

    const cards = document.querySelectorAll(".day-card");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        cards.forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
        selectedDayIndex = Number(card.dataset.index);
        updateHero(forecastDays[selectedDayIndex]);
      });
    });

    const fButton = document.querySelector("#unit-f");
    const cButton = document.querySelector("#unit-c");
    const forecastTemps = document.querySelectorAll(".small-temp");

    fButton.addEventListener("click", () => {
      if (!isCelsius) return;
      isCelsius = false;
      cButton.classList.remove("active");
      fButton.classList.add("active");
      updateHero(forecastDays[selectedDayIndex]);
      forecastTemps.forEach((el) => {
        el.innerHTML = `${el.dataset.maxF}° <span class="min-temp">${el.dataset.minF}°</span>`;
      });
    });

    cButton.addEventListener("click", () => {
      if (isCelsius) return;
      isCelsius = true;
      fButton.classList.remove("active");
      cButton.classList.add("active");
      updateHero(forecastDays[selectedDayIndex]);
      forecastTemps.forEach((el) => {
        el.innerHTML = `${el.dataset.maxC}° <span class="min-temp">${el.dataset.minC}°</span>`;
      });
    });

  } catch (error) {
    dashboard.innerHTML = `
      <div class="error-card">
        <span class="error-icon">🔍</span>
        <h3>Location Not Found</h3>
        <p>We couldn't find weather data for "<strong>${location}</strong>". Please search for a valid city or location.</p>
      </div>
    `;
  } finally {
    if (spinner) spinner.classList.add("hidden");
    dashboard.classList.remove("hidden");
  }
}