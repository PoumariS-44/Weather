
// ==========================================
// ELEMENTS
// ==========================================

const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherDashboard = document.getElementById("weatherDashboard");
const welcome = document.getElementById("welcome");

const loading = document.getElementById("loading");
const message = document.getElementById("message");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");

const weatherIcon = document.getElementById("weatherIcon");
const weatherDescription = document.getElementById("weatherDescription");

const temperature = document.getElementById("temperature");
const temperatureMetric = document.getElementById("temperatureMetric");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const rain = document.getElementById("rain");

const cloudCover = document.getElementById("cloudCover");
const windDirection = document.getElementById("windDirection");
const updatedTime = document.getElementById("updatedTime");


// ==========================================
// API URLS
// ==========================================

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";


// ==========================================
// WEATHER CODE INFORMATION
// ==========================================

function getWeatherInfo(code) {

    const weatherCodes = {

        0: {
            description: "Clear sky",
            icon: "☀️"
        },

        1: {
            description: "Mainly clear",
            icon: "🌤️"
        },

        2: {
            description: "Partly cloudy",
            icon: "⛅"
        },

        3: {
            description: "Overcast",
            icon: "☁️"
        },

        45: {
            description: "Fog",
            icon: "🌫️"
        },

        48: {
            description: "Depositing rime fog",
            icon: "🌫️"
        },

        51: {
            description: "Light drizzle",
            icon: "🌦️"
        },

        53: {
            description: "Moderate drizzle",
            icon: "🌦️"
        },

        55: {
            description: "Dense drizzle",
            icon: "🌧️"
        },

        61: {
            description: "Slight rain",
            icon: "🌦️"
        },

        63: {
            description: "Moderate rain",
            icon: "🌧️"
        },

        65: {
            description: "Heavy rain",
            icon: "🌧️"
        },

        71: {
            description: "Slight snowfall",
            icon: "🌨️"
        },

        73: {
            description: "Moderate snowfall",
            icon: "❄️"
        },

        75: {
            description: "Heavy snowfall",
            icon: "❄️"
        },

        80: {
            description: "Slight rain showers",
            icon: "🌦️"
        },

        81: {
            description: "Moderate rain showers",
            icon: "🌧️"
        },

        82: {
            description: "Violent rain showers",
            icon: "⛈️"
        },

        95: {
            description: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            description: "Thunderstorm with hail",
            icon: "⛈️"
        },

        99: {
            description: "Thunderstorm with heavy hail",
            icon: "⛈️"
        }
    };

    return weatherCodes[code] || {
        description: "Unknown weather",
        icon: "🌤️"
    };
}


// ==========================================
// GET CITY COORDINATES
// ==========================================

async function getCityCoordinates(city) {

    const url =
        `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to connect to the location service.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found. Please check the city name.");
    }

    return data.results[0];
}


// ==========================================
// GET WEATHER DATA
// ==========================================

async function getWeather(latitude, longitude) {

    const url =
        `${WEATHER_API}?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,rain` +
        `&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to fetch weather data.");
    }

    return await response.json();
}


// ==========================================
// DISPLAY WEATHER
// ==========================================

function displayWeather(location, data) {

    const current = data.current;

    const weatherInfo = getWeatherInfo(current.weather_code);


    // Location
    cityName.textContent = location.name;

    countryName.textContent =
        `${location.admin1 || ""}${location.admin1 ? ", " : ""}${location.country}`;


    // Main weather
    temperature.textContent =
        Math.round(current.temperature_2m);

    temperatureMetric.textContent =
        Math.round(current.temperature_2m);

    weatherIcon.textContent =
        weatherInfo.icon;

    weatherDescription.textContent =
        weatherInfo.description;


    // Metrics
    humidity.textContent =
        Math.round(current.relative_humidity_2m);

    windSpeed.textContent =
        Math.round(current.wind_speed_10m);

    rain.textContent =
        current.rain.toFixed(1);


    // Details
    cloudCover.textContent =
        Math.round(current.cloud_cover);

    windDirection.textContent =
        Math.round(current.wind_direction_10m);


    // Updated time
    const date = new Date(current.time);

    updatedTime.textContent =
        date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });


    // Show dashboard
    welcome.classList.add("hidden");

    weatherDashboard.classList.remove("hidden");
}


// ==========================================
// SHOW LOADING
// ==========================================

function showLoading() {

    loading.classList.remove("hidden");

    weatherDashboard.classList.add("hidden");

    welcome.classList.add("hidden");

    message.textContent = "";

    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";
}


// ==========================================
// HIDE LOADING
// ==========================================

function hideLoading() {

    loading.classList.add("hidden");

    searchBtn.disabled = false;

    searchBtn.textContent = "Search";
}


// ==========================================
// SEARCH WEATHER
// ==========================================

async function searchWeather(city) {

    try {

        showLoading();

        // Step 1:
        // Convert city name into latitude and longitude
        const location =
            await getCityCoordinates(city);


        // Step 2:
        // Use coordinates to get weather
        const weatherData =
            await getWeather(
                location.latitude,
                location.longitude
            );


        // Step 3:
        // Display data
        displayWeather(
            location,
            weatherData
        );

    } catch (error) {

        console.error("Weather Error:", error);

        weatherDashboard.classList.add("hidden");

        welcome.classList.remove("hidden");

        message.textContent =
            error.message ||
            "Something went wrong. Please try again.";

    } finally {

        hideLoading();
    }
}


// ==========================================
// FORM SUBMISSION
// ==========================================

weatherForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const city = cityInput.value.trim();


    // Empty input validation
    if (city === "") {

        message.textContent =
            "Please enter a city name.";

        return;
    }


    searchWeather(city);

});


// ==========================================
// DEFAULT CITY
// ==========================================

// You can remove this if you want
// the dashboard to start empty.

searchWeather("Coimbatore");

