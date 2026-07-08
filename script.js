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

// Days Function

const today = new Date();

const days = [];

for(let i = 0; i < 5; i++){

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

// Function to fetch weather
function searchWeather(city = cityInput.value.trim()) {

    if (city === "") {
        msg.innerText = "Please enter a city name.";
        return;
    }

    msg.innerText = "";
    //================================
const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

Promise.all([
    fetch(currentUrl).then(r => r.json()),
    fetch(forecastUrl).then(r => r.json())
])
.then(function([currentData, forecastData]) {
     // Invalid city
            if (currentData.cod !== 200) {
                msg.innerText = "City not found.";
                return;
            }
            document.getElementById("weatherIcon").src =`https://openweathermap.org/img/wn/${currentData.weather[0].icon}@4x.png`;
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

            if (humidityCategory === "Very Dry") {
                humidBox.style.backgroundImage = "url('images/very dry.jpg')";
            }
            else if (humidityCategory === "Dry") {
                humidBox.style.backgroundImage = "url('images/dry.jpg')";
            }
            else if (humidityCategory === "Comfortable") {
                humidBox.style.backgroundImage = "url('images/comfortable.jpg')";
            }
            else if (humidityCategory === "Humid") {
                humidBox.style.backgroundImage = "url('images/humid.jpg')";
            }
            else {
                humidBox.style.backgroundImage = "url('images/very humid.jpg')";
            }

// ============== Weather =============//
            switch(weather){

            case "Clear":
                bgVideo.src = "videos/Clear.mp4";
                break;

            case "Clouds":
                bgVideo.src = "videos/Cloudy.mp4";
                break;

            case "Rain":
            bgVideo.src = "videos/Rainy.mp4";
                break;

            case "Drizzle":
                bgVideo.src = "videos/Rainy.mp4";
                break;

            case "Thunderstorm":
                bgVideo.src = "videos/Thunderstorm.mp4";
                break;

            case "Snow":
                bgVideo.src = "videos/Foggy.mp4";
                break;

            case "Mist":
            case "Fog":
                bgVideo.src = "videos/Foggy.mp4";
                break;
            case "Haze":
                bgVideo.src = "videos/Mist.mp4";
                
                break;

            default:
                bgVideo.src = "videos/Clear.mp4";
            }
            bgVideo.load();
            bgVideo.play();

// ============ Wind Speed ============//
       
        const category = getWindCategory(windSpeed);
        wind.innerText = `${windSpeed.toFixed(2)} m/s \n ${category}`;

        if(category === "Calm"){
            windy.style.backgroundImage = "url('images/calm wind.jpg')";
        } else if (category === "Light Breeze"){
            windy.style.backgroundImage = "url('images/breezy wind.jpg')";
        } else if (category === "Moderate Wind"){
            windy.style.backgroundImage = "url('images/moderate.png')";
        } else if (category === "Strong Wind"){
            windy.style.backgroundImage = "url('images/windy.jpg')";
        } else {
            windy.style.backgroundImage = "url('images/storm.jpg')";
        }

// ========= Feels Like ==============//
        const feelsLikeTemp = Math.round(currentData.main.feels_like);

        const feelCategory = getFeelsLikeCategory(feelsLikeTemp);

        feelsLike.innerText = `${feelsLikeTemp}°\n${feelCategory}`;

        if(feelCategory === "🥶 Freezing"){
            feel.style.backgroundImage = "url('images/freezing-feel.jpg')";
        } else if (feelCategory === "🧥 Very Cold"){
            feel.style.backgroundImage = "url('images/veryCold-feel.jpg')";
        } else if (feelCategory === "🍃 Cool"){
            feel.style.backgroundImage = "url('images/cold-feel.jpg')";
        } else if (feelCategory === "😊 Pleasant"){
            feel.style.backgroundImage = "url('images/pleasant-feel.jpg')";
        } else if(feelCategory === "☀️ Warm"){
            feel.style.backgroundImage = "url('images/warm-feel.jpg')";
        } else if(feelCategory === "🥵 Hot"){
            feel.style.backgroundImage = "url('images/hot-feel.jpg')";
        } else{
            feel.style.backgroundImage = "url('images/extremeHeat-feel.jpg')";
        }

    // new forecast logic using forecastData

    function showForecast(day){

        // Remove previous cards
        forecastContainer.innerHTML = "";

        // Loop through all forecast data
        for(let i = 0; i < forecastData.list.length; i++){

            if(forecastData.list[i].dt_txt.split(" ")[0] === day){

                const card = document.createElement("div");
                const date = new Date(forecastData.list[i].dt_txt);
                const formattedDate = date.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric"
                });

                
                card.className = "forecast-card";
                card.style.backgroundImage = `url(images/${forecastData.list[i].weather[0].main}.jpg)`
                card.innerHTML = `<div class="forecast-content">
                        <h3>${formattedDate}</h3>
                        <h4>${forecastData.list[i].main.temp} °C</h4>
                        <p>Time : ${forecastData.list[i].dt_txt.split(" ")[1]}</p>
                        <p>${forecastData.list[i].weather[0].main}</p>
                    </div>
                    `
                
                forecastContainer.appendChild(card);
            }

        }

    }

    document.getElementById("Today").addEventListener("click", () => {
        showForecast(days[0]);
    });

    document.getElementById("Second").addEventListener("click", () => {
        showForecast(days[1]);
    });

    document.getElementById("Third").addEventListener("click", () => {
        showForecast(days[2]);
    });

    document.getElementById("Fourth").addEventListener("click", () => {
        showForecast(days[3]);
    });

    document.getElementById("Fifth").addEventListener("click", () => {
        showForecast(days[4]);
    });

    showForecast(days[0])
    })
.catch(function() {
    msg.innerText = "Something went wrong!";
});

}

// Search button
searchBtn.addEventListener("click", searchWeather);

// Enter key
cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchWeather();
    }
});

// Default weather when page opens
searchWeather("Khalilabad");

const buttons = document.querySelectorAll(".day");

buttons.forEach(button => {

    button.addEventListener("click", () => {

        buttons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

    });

});