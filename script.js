const API_KEY = "1b97360571c917dca7ec02c69c6fcd32";

// Get the input and button
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const msg = document.getElementById("errorMsg");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidBox = document.querySelector(".humid");
const bgVideo = document.getElementById("bgVideo");
const feel = document.querySelector(".feel");
const windy = document.querySelector(".windy");
const forecastContainer = document.querySelector(".forecast-container");

const dayButtons = document.querySelectorAll(".day");
const statusButtons = document.querySelectorAll(".status");

// ============ State ================//

let currentDay = null;    
let currentType = "weather"; 
let latestForecastData = null; 

// Days Function

const today = new Date();

const days = [];

for (let i = 0; i < 5; i++) {

    const date = new Date(today);

    date.setDate(today.getDate() + i);

    days.push(date.toLocaleDateString("en-CA"));

}



// Humidity Function
function getHumidityCategory(humidity) {
    if (humidity <= 20) return "Very Dry";
    if (humidity <= 40) return "Dry";
    if (humidity <= 60) return "Comfortable";
    if (humidity <= 80) return "Humid";

    return "Very Humid";
}

// Wind Function
function getWindCategory(speed) {
    if (speed <= 1.5) return "Calm";
    if (speed <= 3.3) return "Light Breeze";
    if (speed <= 5.5) return "Moderate Wind";
    if (speed <= 8.0) return "Strong Wind";

    return "Very Windy";
}
// Feels Like function
function getFeelsLikeCategory(temp) {
    if (temp < 0) return "🥶 Freezing";
    if (temp <= 10) return "🧥 Very Cold";
    if (temp <= 20) return "🍃 Cool";
    if (temp <= 28) return "😊 Pleasant";
    if (temp <= 35) return "☀️ Warm";
    if (temp <= 42) return "🥵 Hot";

    return "🔥 Extreme Heat";
}

// ============ Image helpers  ================//
function getHumidityImage(category) {
    switch (category) {
        case "Very Dry": 
        return "images/very dry.jpg";

        case "Dry": 
        return "images/dry.jpg";

        case "Comfortable": 
        return "images/comfortable.jpg";

        case "Humid": 
        return "images/humid.jpg";

        default: 
        return "images/very-humid.jpg";
    }
}

function getWindImage(category) {
    switch (category) {
        case "Calm": 
        return "images/calm-wind.jpg";

        case "Light Breeze": 
        return "images/breezy-wind.jpg";

        case "Moderate Wind": 
        return "images/moderate.png";

        case "Strong Wind": 
        return "images/windy.jpg";

        default: 
        return "images/storm.jpg";
    }
}

function getFeelsLikeImage(category) {
    switch (category) {
        case "🥶 Freezing": 
        return "images/freezing-feel.jpg";

        case "🧥 Very Cold": 
        return "images/veryCold-feel.jpg";

        case "🍃 Cool": 
        return "images/cold-feel.jpg";

        case "😊 Pleasant": 
        return "images/pleasant-feel.jpg";

        case "☀️ Warm": 
        return "images/warm-feel.jpg";

        case "🥵 Hot": 
        return "images/hot-feel.jpg";

        default: 
        return "images/extremeHeat-feel.jpg";
    }
}

function getWeatherVideo(weather) {
    switch (weather) {
        case "Clear": 
        return "videos/Clear.mp4";

        case "Clouds": 
        return "videos/Cloudy.mp4";

        case "Rain":
        case "Drizzle": 
        return "videos/Rainy.mp4";

        case "Thunderstorm": 
        return "videos/Thunderstorm.mp4";

        case "Snow": 
        return "videos/Foggy.mp4";

        case "Mist":
        case "Fog": 
        return "videos/Foggy.mp4";

        case "Haze": 
        return "videos/Mist.mp4";

        default: 
        return "videos/Clear.mp4";
    }
}

// ============ Single shared forecast renderer ================//

function showForecast(selectedDay, selectedType) {

    if (!latestForecastData || !selectedDay) return;

    forecastContainer.innerHTML = "";

    for (let i = 0; i < latestForecastData.list.length; i++) {

        const item = latestForecastData.list[i];

        if (item.dt_txt.split(" ")[0] !== selectedDay) continue;

        const date = new Date(item.dt_txt);
        const formattedDate = date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric"
        });
        const time = item.dt_txt.split(" ")[1];

        let bgImage = "";
        let mainValue = "";
        let categoryLabel = "";

        if (selectedType === "weather") {
            const weatherMain = item.weather[0].main;
            bgImage = `images/${weatherMain}.jpg`;
            mainValue = `${Math.round(item.main.temp)} °C`;
            categoryLabel = weatherMain;

        } else if (selectedType === "humidity") {
            const humidityValue = item.main.humidity;
            const category = getHumidityCategory(humidityValue);
            bgImage = getHumidityImage(category);
            mainValue = `${humidityValue}%`;
            categoryLabel = category;

        } else if (selectedType === "wind") {
            const windSpeed = item.wind.speed;
            const category = getWindCategory(windSpeed);
            bgImage = getWindImage(category);
            mainValue = `${windSpeed.toFixed(2)} m/s`;
            categoryLabel = category;

        } else if (selectedType === "feelsLike") {
            const feelsLikeTemp = Math.round(item.main.feels_like);
            const category = getFeelsLikeCategory(feelsLikeTemp);
            bgImage = getFeelsLikeImage(category);
            mainValue = `${feelsLikeTemp}°`;
            categoryLabel = category;
        }

        const card = document.createElement("div");
        card.className = "forecast-card";
        card.style.backgroundImage = `url(${bgImage})`;
        card.innerHTML = `<div class="forecast-content">
                <h3>${formattedDate}</h3>
                <h4>${mainValue}</h4>
                <p>Time : ${time}</p>
                <p>${categoryLabel}</p>
            </div>
            `;

        forecastContainer.appendChild(card);
    }
}

// Function to fetch weather
function searchWeather(city = cityInput.value.trim()) {

    if (city === "") {
        msg.innerText = "Please enter a city name.";
        return;
    }

    msg.innerText = "";

    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    Promise.all([
        fetch(currentUrl).then(r => r.json()),
        fetch(forecastUrl).then(r => r.json())
    ])
        .then(function ([currentData, forecastData]) {
            // Invalid city
            if (currentData.cod !== 200) {
                msg.innerText = "City not found.";
                return;
            }
            document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@4x.png`;
            msg.innerText = "";
            const weather = currentData.weather[0].main;
            const humidityValue = currentData.main.humidity;
            const windSpeed = currentData.wind.speed;
            condition.innerHTML = `${weather}`
            cityName.innerText = currentData.name;
            temperature.innerText = `${Math.round(currentData.main.temp)}°`;

            // ======== Humidity Section ==============//

            const humidityCategory = getHumidityCategory(humidityValue);
            humidity.innerText = `${humidityValue}%\n${humidityCategory}`;
            humidBox.style.backgroundImage = `url('${getHumidityImage(humidityCategory)}')`;

            // ============== Weather video =============//

            bgVideo.src = getWeatherVideo(weather);
            bgVideo.load();
            bgVideo.play();

            // ============ Wind Speed ============//

            const category = getWindCategory(windSpeed);
            wind.innerText = `${windSpeed.toFixed(2)} m/s \n ${category}`;
            windy.style.backgroundImage = `url('${getWindImage(category)}')`;

            // ========= Feels Like ==============//

            const feelsLikeTemp = Math.round(currentData.main.feels_like);
            const feelCategory = getFeelsLikeCategory(feelsLikeTemp);
            feelsLike.innerText = `${feelsLikeTemp}°\n${feelCategory}`;
            feel.style.backgroundImage = `url('${getFeelsLikeImage(feelCategory)}')`;

            // ============ Store forecast data & render ================//

            latestForecastData = forecastData;

            if (currentDay === null) {
                currentDay = days[0];
            }

            showForecast(currentDay, currentType);

        })
        .catch(function () {
            msg.innerText = "Something went wrong!";
        });

}

// ============ Day buttons ================//

dayButtons.forEach((button, index) => {

    button.addEventListener("click", () => {

        dayButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        currentDay = days[index];

        showForecast(currentDay, currentType);
    });

});

// ============ Status buttons: Weather / Humidity / Wind / Feels Like ================//
statusButtons.forEach((button) => {

    button.addEventListener("click", () => {

        statusButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        if (button.classList.contains("look")) {
            currentType = "weather";
        } else if (button.classList.contains("humidityStatus")) {
            currentType = "humidity";
        } else if (button.classList.contains("windStatus")) {
            currentType = "wind";
        } else if (button.classList.contains("feelsLikeStatus")) {
            currentType = "feelsLike";
        }

        showForecast(currentDay, currentType);
    });

});

// Set default active buttons: Today + Weather ("look")

dayButtons[0].classList.add("active");
document.querySelector(".look.status").classList.add("active");

// Search button
searchBtn.addEventListener("click", searchWeather);

// Enter key
cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchWeather();
    }
});

// Default weather when page opens
searchWeather("Khalilabad");