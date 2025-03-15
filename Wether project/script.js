const inputBox = document.querySelector(".input-box");
const searchBtn = document.getElementById("search-button");

const weatherImg = document.querySelector(".weather-img");
const temp = document.querySelector(".temperature");
const description = document.querySelector(".description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const locationNotFound = document.querySelector('.location-not-found');
const weatherBody = document.querySelector('.weather-body');

async function checkWeather(city) {
    const apiKey = "d1124ae8d96739ec7d86b8a1b748f21d";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const weatherData = await response.json();

        if (weatherData.cod === '404') {
            locationNotFound.style.display = "flex"; // Show "location not found" message
            weatherBody.style.display = "none";
            return;
        }

        locationNotFound.style.display = "none"; // Hide "location not found" message
        weatherBody.style.display = "flex";

        temp.innerHTML = `${Math.round(weatherData.main.temp)}°C`;
        description.innerHTML = `${weatherData.weather[0].description}`;
        humidity.innerHTML = `${weatherData.main.humidity}%`;
        windSpeed.innerHTML = `${weatherData.wind.speed} km/h`;

        weatherImg.src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

async function fetchForecast(city) {
    const apiKey = "d1124ae8d96739ec7d86b8a1b748f21d";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const forecastData = await response.json();

        const forecastContainer = document.querySelector('.forecast-container');
        forecastContainer.innerHTML = "";

        forecastData.list.forEach((entry, index) => {
            if (index % 8 === 0) {
                const forecastItem = document.createElement('div');
                forecastItem.classList.add('forecast-item');

                const date = new Date(entry.dt * 1000);
                const day = date.toLocaleDateString('en-US', { weekday: 'short' });

                forecastItem.innerHTML = `
                    <p>${day}</p>
                    <img src="http://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png" alt="${entry.weather[0].description}">
                    <p>${Math.round(entry.main.temp)}°C</p>
                    <p>${entry.weather[0].description}</p>
                `;

                forecastContainer.appendChild(forecastItem);
            }
        });
    } catch (error) {
        console.error("Error fetching forecast data:", error);
    }
}

searchBtn.addEventListener('click', () => {
    const city = inputBox.value;
    checkWeather(city);
    fetchForecast(city);
});
