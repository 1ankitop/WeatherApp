const apiKey = "c60d75f553d75bc331bc5334f6a149b9";
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const geoBtn = document.getElementById("geo-btn");


window.addEventListener("DOMContentLoaded", () => {
    fetchWeather("Delhi"); 
});


async function fetchWeather(city) {
    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

        const [weatherRes, forecastRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl)
        ]);

        if (!weatherRes.ok) throw new Error("City not found");

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        updateCurrentWeather(weatherData);
        updateForecast(forecastData);
        document.getElementById("error-msg").style.display = "none";
        document.getElementById("weather-display").style.opacity = "1";

    } catch (error) {
        document.getElementById("error-msg").style.display = "block";
        document.getElementById("weather-display").style.opacity = "0.3";
    }
}


function updateCurrentWeather(data) {
    document.getElementById("city-name").innerText = data.name;
    document.getElementById("current-date").innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });
    document.getElementById("main-temp").innerText = `${Math.round(data.main.temp)}°`;
    document.getElementById("weather-desc").innerText = data.weather[0].description;
    document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    
    document.getElementById("feels-like").innerText = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById("humidity").innerText = `${data.main.humidity}%`;
    document.getElementById("wind-speed").innerText = `${data.wind.speed} km/h`;
    document.getElementById("pressure").innerText = `${data.main.pressure} hPa`;

    
    if (data.main.temp > 28) {
        document.body.style.background = "linear-gradient(135deg, #f6d365 0%, #fda085 100%)";
    } else {
        document.body.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }
}


function updateForecast(data) {
    const container = document.getElementById("forecast-container");
    container.innerHTML = "";

    
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const forecastHTML = `
            <div class="forecast-item">
                <p>${dayName}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="icon">
                <p>${Math.round(day.main.temp)}°</p>
            </div>
        `;
        container.innerHTML += forecastHTML;
    });
}


searchBtn.addEventListener("click", () => fetchWeather(cityInput.value));

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") fetchWeather(cityInput.value);
});

geoBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
            const data = await res.json();
            fetchWeather(data.name);
        });
    }
});
