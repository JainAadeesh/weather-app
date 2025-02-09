// Selecting DOM elements
const elements = {
  searchInput: document.getElementById('searchInput'),
  searchBtn: document.getElementById('searchBtn'),
  currentLocationBtn: document.getElementById('currentLocationBtn'),
  recentSearches: document.getElementById('recentSearches'),
  cityname: document.getElementById('cityname'),
  dateTime: document.getElementById('dateTime'),
  temperature: document.getElementById('temperature'),
  feelsLike: document.getElementById('feelsLike'),
  weatherIcon: document.getElementById('weatherIcon'),
  weatherDescription: document.getElementById('weatherDescription'),
  humidity: document.getElementById('humidity'),
  wind: document.getElementById('wind'),
  forecastContainer: document.getElementById('forecastContainer')
};

// API setup
const apiKey = 'cd90ce4504fea82fc3b20bb4d2ad59a7', baseUrl = 'https://api.openweathermap.org/data/2.5/';

// Fetch weather data
async function getWeatherData(city) {
  try {
    const response = await fetch(`${baseUrl}weather?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) throw new Error('Weather data not found.');
    const data = await response.json();
    displayWeatherData(data);
    storeRecentSearch(city);
    fetchForecastData(city);
  } catch (error) {
    alert('Could not fetch weather data. Please try again.');
  }
}

// Fetch 5-day forecast data
async function fetchForecastData(city) {
  try {
    const response = await fetch(`${baseUrl}forecast?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) throw new Error('Forecast data not found.');
    const data = await response.json();
    displayForecastData(data);
  } catch (error) {
    console.error(error);
  }
}

// Display current weather data
function displayWeatherData(data) {
  const currentDate = new Date();
  elements.cityname.textContent = data.name;
  elements.dateTime.textContent = currentDate.toLocaleString();
  elements.temperature.textContent = `${Math.round(data.main.temp)}°C`;
  elements.feelsLike.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
  elements.weatherDescription.textContent = data.weather[0].description;
  elements.humidity.textContent = `Humidity: ${data.main.humidity}%`;
  elements.wind.textContent = `Wind: ${data.wind.speed} km/h`;
  elements.weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

// Display forecast data
function displayForecastData(data) {
  elements.forecastContainer.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const forecast = data.list[i * 8], date = new Date(forecast.dt * 1000),
      day = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
    const card = document.createElement('div');
    card.classList.add('p-6', 'rounded-2xl', 'shadow-lg', 'text-center', 'transform', 'transition-transform', 'duration-300', 'ease-in-out', 'hover:scale-110');
    card.innerHTML = `
      <h3 class="text-lg font-semibold">${day}</h3>
      <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather Icon" class="mx-auto my-2 w-16">
      <p class="text-xl font-bold">${Math.round(forecast.main.temp)}°C</p>
      <p>${forecast.weather[0].description}</p>
      <p>Wind: ${forecast.wind.speed} km/h</p>
      <p>Humidity: ${forecast.main.humidity}%</p>
    `;
    elements.forecastContainer.appendChild(card);
  }
}

// Store and update recent searches
function storeRecentSearch(city) {
  const recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
  if (!recentCities.includes(city)) {
    recentCities.push(city);
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
  }
  updateRecentSearches();
}

// Update recent searches dropdown
function updateRecentSearches() {
  const recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
  elements.recentSearches.innerHTML = '';
  if (recentCities.length) {
    elements.recentSearches.classList.remove('hidden');
    recentCities.forEach(city => {
      const listItem = document.createElement('li');
      listItem.textContent = city;
      listItem.classList.add('p-2', 'cursor-pointer', 'hover:bg-gray-200');
      listItem.addEventListener('click', () => getWeatherData(city));
      elements.recentSearches.appendChild(listItem);
    });
  } else {
    elements.recentSearches.classList.add('hidden');
  }
}

// Get weather data for current location
function getCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude: lat, longitude: lon } = position.coords;
      fetch(`${baseUrl}weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
          displayWeatherData(data);
          fetchForecastData(data.name);
        })
        .catch(console.error);
    });
  } else {
    alert('Geolocation not supported.');
  }
}

// Validate search input
function validateSearchInput(input) {
  if (!input.trim()) {
    alert('Please enter a valid city name.');
    return false;
  }
  return true;
}

// Event listeners
elements.searchBtn.addEventListener('click', () => {
  const city = elements.searchInput.value.trim();
  if (validateSearchInput(city)) {
    getWeatherData(city);
    elements.searchInput.value = '';
  }
});

elements.currentLocationBtn.addEventListener('click', getCurrentLocationWeather);

// Initialize
updateRecentSearches();
