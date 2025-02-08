const url = 'https://weather-api138.p.rapidapi.com/weather?city_name=New%20York';
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '00211c4191msh0c533e4eddd4469p11cf59jsnfb7996d59ba6',
        'x-rapidapi-host': 'weather-api138.p.rapidapi.com'
    }
};

document.addEventListener("DOMContentLoaded", () => {
    loadRecentSearches();
    fetchWeather("New York");

    document.getElementById("searchBtn").addEventListener("click", () => {
        const city = document.getElementById("searchInput").value;
        if (city) {
            fetchWeather(city);
            storeRecentSearch(city);
        }
    });

    document.getElementById("currentLocationBtn").addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            });
        }
    });
});

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://weather-api138.p.rapidapi.com/weather?city_name=${city}`, options);
        const data = await response.json();
        updateUI(data, city);
    } catch (error) {
        console.log("Error fetching weather data:", error);
    }
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`https://weather-api138.p.rapidapi.com/weather?lat=${lat}&lon=${lon}`, options);
        const data = await response.json();
        updateUI(data, data.name);
    } catch (error) {
        alert("Error fetching location-based weather data:", error);
    }
}

function updateUI(data, city) {
    document.getElementById("dateTime").textContent = new Date().toLocaleString();
    document.getElementById("cityname").textContent = city;
    document.getElementById("temperature").textContent = `${data.main.temp}°C`;
    document.getElementById("feelsLike").textContent = `Feels like ${data.main.feels_like}°C`;
    document.getElementById("weatherIcon").textContent = `${data.weather[0].icon}`;
    document.getElementById("weatherDescription").textContent = data.weather[0].description;
    document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").textContent = `Wind: ${data.wind.speed} km/h`;
    document.getElementById("precipitation").textContent = `Precipitation: ${data.pop || 0}%`;

    const forecastContainer = document.getElementById("forecastContainer");
    forecastContainer.innerHTML = "";
    data.daily.slice(0, 5).forEach(day => {
        const forecastCard = document.createElement("div");
        forecastCard.classList.add("p-6", "rounded-2xl", "shadow-lg", "text-center");
        forecastCard.innerHTML = `
            <h3 class="text-lg font-semibold">${new Date(day.dt * 1000).toLocaleDateString()}</h3>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}" class="mx-auto my-2 w-16">
            <p class="text-xl font-bold">${day.temp.day}°C</p>
            <p>${day.weather[0].description}</p>
        `;
        forecastContainer.appendChild(forecastCard);
    });
}

function storeRecentSearch(city) {
    let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    if (!searches.includes(city)) {
        searches.unshift(city);
        if (searches.length > 5) searches.pop();
        localStorage.setItem("recentSearches", JSON.stringify(searches));
    }
    loadRecentSearches();
}

function loadRecentSearches() {
    const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    const searchList = document.getElementById("recentSearches");
    searchList.innerHTML = "";
    recentSearches.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;
        li.classList.add("cursor-pointer", "p-2", "hover:bg-gray-200", "flex", "justify-between", "items-center");
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.classList.add("ml-2", "text-red-500");
        removeBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            removeRecentSearch(city);
        });
        
        li.appendChild(removeBtn);
        li.addEventListener("click", () => fetchWeather(city));
        searchList.appendChild(li);
    });
    searchList.classList.toggle("hidden", recentSearches.length === 0);
}

function removeRecentSearch(city) {
    let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    searches = searches.filter(item => item !== city);
    localStorage.setItem("recentSearches", JSON.stringify(searches));
    loadRecentSearches();
}
