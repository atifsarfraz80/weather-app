import { weatherIcons } from "./assets/weather-icons/export.js";
export async function loadDetails(string) {
  const key = "UVNMRABPQ9XF8G9F56E8YA24T";

  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${string}?key=${key}`
  );

  const body = await response.json();

  const dashboard = document.querySelector("#weather-dashboard");

  const address = body.address.toUpperCase();
  const description = body.description;

  const toCelsius = (f) => Math.round((f - 32) * (5 / 9));

  const temp = body.days[0].temp;
  const tempC = toCelsius(temp);

  const maxTemp = body.days[0].tempmax;
  const maxTempC = toCelsius(maxTemp);

  const minTemp = body.days[0].tempmin;
  const minTempC = toCelsius(minTemp);

  const feelsLike = body.days[0].feelslike;
  const feelsLikeC = toCelsius(feelsLike);

  const feelsLikeMax = body.days[0].feelslikemax;
  const feelsLikeMaxC = toCelsius(feelsLikeMax);

  const feelsLikeMin = body.days[0].feelslikemin;
  const feelsLikeMinC = toCelsius(feelsLikeMin);

  const condition = body.days[0].conditions;

  const date = body.days[0].datetime;

  const icon = body.days[0].icon;
  const svgUrl = weatherIcons[icon] || weatherIcons["cloudy"];

  const dateObj = new Date(date);
  const day = dateObj.toLocaleDateString("en-US", { weekday: "long" });

  const precipation = Math.round(body.days[0].precip * 100);
  const windSpeed = body.days[0].windspeed;
  const humidity = body.days[0].humidity;

  const clearDay = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 57.47 57.47"><defs><style>.cls-1{fill:#f5b952;}.cls-2,.cls-3{fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:3px;}.cls-2{stroke-linecap:round;}</style></defs><title>clear-dayAsset 222colored</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M28.7,43.71h0a14.86,14.86,0,1,0,0-29.71h.05a14.86,14.86,0,1,0,0,29.71H28.7Z"/><line class="cls-2" x1="8.55" y1="28.73" x2="1.5" y2="28.73"/><line class="cls-2" x1="14.15" y1="42.85" x2="9.07" y2="47.75"/><line class="cls-2" x1="14.75" y1="14.28" x2="9.82" y2="9.24"/><line class="cls-2" x1="10.03" y1="36.46" x2="3.51" y2="39.14"/><line class="cls-2" x1="21.11" y1="10.12" x2="18.39" y2="3.62"/><line class="cls-2" x1="20.57" y1="47.38" x2="17.75" y2="53.85"/><line class="cls-2" x1="10.25" y1="20.74" x2="3.78" y2="17.95"/><path class="cls-3" d="M28.7,43.71h0a14.86,14.86,0,1,0,0-29.71h.05a14.86,14.86,0,1,0,0,29.71H28.7Z"/><line class="cls-2" x1="48.92" y1="28.73" x2="55.97" y2="28.73"/><line class="cls-2" x1="28.73" y1="8.55" x2="28.73" y2="1.5"/><line class="cls-2" x1="28.73" y1="48.92" x2="28.73" y2="55.97"/><line class="cls-2" x1="43.32" y1="42.85" x2="48.39" y2="47.75"/><line class="cls-2" x1="42.72" y1="14.28" x2="47.65" y2="9.24"/><line class="cls-2" x1="47.44" y1="36.46" x2="53.96" y2="39.14"/><line class="cls-2" x1="36.36" y1="10.12" x2="39.08" y2="3.62"/><line class="cls-2" x1="36.89" y1="47.38" x2="39.72" y2="53.85"/><line class="cls-2" x1="47.21" y1="20.74" x2="53.69" y2="17.95"/></g></g></svg>`;

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
          <img src="${svgUrl}" alt="cloudy day" class="weather-icon">
          <div class="hero-temp-group">
            <span id="current-temp" class="hero-temp">${tempC}</span>
            <span class="unit-symbol">°C</span>
          </div>
          <div class="hero-details">
            <p>Precipitation: <span id="precipitation">${precipation}%</span></p>
            <p>Humidity: <span id="humidity">${humidity}%</span></p>
            <p>Wind: <span id="wind-speed">${windSpeed} km/h</span></p>
          </div>
        </div>

        <div class="condition-summary">
          <h3 id="app-name-tag">Weather</h3>
          <p id="current-day">${day}</p>
          <p id="current-date">${date}</p>
          <p id="weather-condition" class="condition-text">${condition}</p>
          
        </div>
      </section>`;
}
