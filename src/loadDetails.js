let body;
async function loadDetails(string) {
  const key = "UVNMRABPQ9XF8G9F56E8YA24T";

  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${string}?key=${key}`
  );

  body = await response.json();

  return body;
}

loadDetails("Lahore").then((body) => {
  const maxTemp = body.days[0].tempmax;
const minTemp = body.days[0].tempmin;

console.log(`Today's High: ${maxTemp}°F`);
console.log(`Today's Low: ${minTemp}°F`);
});
