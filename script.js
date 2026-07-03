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


// Function to fetch weather
function searchWeather(city = cityInput.value.trim()) {

    if (city === "") {
        msg.innerText = "Please enter a city name.";
        return;
    }

    msg.innerText = "";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // Invalid city
            if (data.cod !== 200) {
                msg.innerText = "City not found.";
                return;
            }
            document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
            msg.innerText = "";
            const weather = data.weather[0].main;
            const humidityValue = data.main.humidity;
            condition.innerHTML = `Weather Description: ${weather}`
            cityName.innerText = data.name;
            temperature.innerText = `${Math.round(data.main.temp)}°`;
            humidity.innerText = `${humidityValue}%`;
            wind.innerText = `${data.wind.speed} km/h`;
            feelsLike.innerText = `${Math.round(data.main.feels_like)}°`;

            // ======== Humidity Section ==============//

            if (humidityValue <= 20) {
                humidBox.style.backgroundImage = "url('images/very dry.jpg')";
            }
            else if (humidityValue <= 40) {
                humidBox.style.backgroundImage = "url('images/dry.jpg')";
            }
            else if (humidityValue <= 60) {
                humidBox.style.backgroundImage = "url('images/comfortable.jpg')";
            }
            else if (humidityValue <= 80) {
                humidBox.style.backgroundImage = "url('images/humid.jpg')";
            }
            else {
                humidBox.style.backgroundImage = "url('images/very humid.jpg')";
            }

// ============== Weather =============//
            switch(weather){

            case "Clear":
                bgVideo.src = "videos/Clear.mp4";
                bgVideo.load();
                bgVideo.play();
                break;

            case "Clouds":
                bgVideo.src = "videos/Cloudy.mp4";
                bgVideo.load();
                bgVideo.play();
                break;

            case "Rain":
            bgVideo.src = "videos/Rainy.mp4";
                bgVideo.load();
                bgVideo.play();
                break;

            case "Drizzle":
                bgVideo.src = "videos/Rainy.mp4";
                bgVideo.load();
                bgVideo.play();
                break;

            case "Thunderstorm":
                bgVideo.src = "videos/Thunderstorm.mp4";
                bgVideo.load();
                bgVideo.play();
                break;

            case "Snow":
                bgVideo.src = "videos/Foggy.mp4";
                bgVideo.load();
                bgVideo.play();
                break;

            case "Mist":
            case "Fog":
                bgVideo.src = "videos/Foggy.mp4";
                bgVideo.load();
                bgVideo.play();
                break;
            case "Haze":
                bgVideo.src = "videos/Mist.mp4";
                bgVideo.load();
                bgVideo.play();
                break;

            default:
                bgVideo.src = "videos/Clear.mp4";
                bgVideo.load();
                bgVideo.play();
            }
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