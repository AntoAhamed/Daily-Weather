const searchForm = document.getElementById('search-form');
const currentWeather = document.getElementById('current-weather');
const hourlyForecast = document.getElementById('hourly-forecast');
const weeklyForecast = document.getElementById('weekly-forecast');

const fetchWeatherData = (location = "Dhaka") => {
    // Construct the API URL
    const apiKey = '43a9135c1c0c47ec827140339242904';
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=yes&alerts=no`;

    // Fetch weather data from the API
    fetch(apiUrl)
        .then(response => { //if fetch operation is failed...
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            return response.json();
        })
        .then(data => { //if fetch operation is successfull...
            // Extract relevant weather information
            const current = data.current;
            const forecast = data.forecast;
            const cityName = data.location.name;
            const localTime = data.location.localtime;

            // Display current weather information
            currentWeather.innerHTML = `
                <p>Weather in ${cityName}</p>
                <p>${localTime}</p>
                <div class="primary">
                    <div>
                        <p>${current.temp_c}°C</p>
                    </div>
                    <div>
                        <p>${current.condition.text}</p>
                        <p>Feelslike: ${current.feelslike_c}°C</p>
                    </div>
                </div>
                <div class="secondary">
                    <p>Wind Speed: ${current.wind_kph}km/h</p>
                    <p>Humidity: ${current.humidity}%</p>
                    <p>Visibility: ${current.vis_km}km</p>
                    <p>Pressure: ${current.pressure_mb}mb</p>
                </div>
            `;

            // Display 24-hour forecast information
            const hourlyData = forecast.forecastday[0].hour;
            hourlyForecast.innerHTML = `
                <h2>24-Hour Forecast</h2>
                <ul>
                    ${hourlyData.map((hour) => {
                        let onlyTime = hour.time.substr(12, 15);
                        return `<li><span>${onlyTime}</span><span>${hour.temp_c}°C</span><span>${hour.condition.text}</span></li>`
                    }).join('')}
                </ul>
            `;

            // Display 7-day forecast information
            weeklyForecast.innerHTML = `
                <h2>7 Days Forecast</h2>
                <ul>
                    ${forecast.forecastday.slice(1).map(day => `
                        <li>
                            <strong>${day.date}</strong>: High ${day.day.maxtemp_c}°C, Low ${day.day.mintemp_c}°C, ${day.day.condition.text}
                        </li>
                    `).join('')}
                </ul>
            `;
        })
        .catch(error => { //if fetch operation gets some error...
            console.error('Error fetching weather data:', error);
            alert("Error fetching weather data. Please try again later.");
            fetchWeatherData(); //default locations weather will be showen.
        });
}

window.onload = fetchWeatherData(); //On load default locations weather will be showen

searchForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const searchInput = document.getElementById('search-input');
    const location = searchInput.value.trim(); // Get the value entered by the user

    fetchWeatherData(location);
});
