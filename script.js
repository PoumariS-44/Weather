const apiKey = "8af7be9cb9d8a6a311493dffb9ce528b";

const cityInput =
    document.getElementById("cityInput");

const city =
    document.getElementById("city");

const temperature =
    document.getElementById("temperature");

const description =
    document.getElementById("description");

const humidity =
    document.getElementById("humidity");

const wind =
    document.getElementById("wind");

const feelsLike =
    document.getElementById("feelsLike");

const weatherIcon =
    document.getElementById("weatherIcon");

const error =
    document.getElementById("error");

async function getWeather() {

    const cityName =
        cityInput.value.trim();

    if (cityName === "") {

        error.textContent =
            "Please enter a city name.";
        return;

    }
    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {

            throw new Error(
                "City not found."
            );

        }
        const data =
            await response.json();

        city.textContent =
            data.name;

        temperature.textContent =
            Math.round(
                data.main.temp
            ) + "°C";

        description.textContent =
            data.weather[0].description;

        humidity.textContent =
            data.main.humidity + "%";

        wind.textContent =
            data.wind.speed + " m/s";

        feelsLike.textContent =
            Math.round(
                data.main.feels_like
            ) + "°C";

        weatherIcon.src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        error.textContent = "";

    } catch (err) {

        error.textContent =
            "City not found. Please try again.";

        console.log(err);

    }

}
