var APIkey = "27a9f332092005bcc51e13fb84d6b86f";

var cityInput = $('#city-input');
var searchBtn = $('#search-button');
var clearBtn = $('#clear-button');
var pastSearchedCities = $('#past-searches');

var currentCity;


//============use Open Weather 'One Call API' to get weather based on city coordinates============//
function getWeather(data) {

    var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.lat}&lon=${data.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${APIkey}`
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            //==========current weather=======================//
            var currentConditions = $('#currentConditions');
            currentConditions.addClass('border border-dark bg-secondary');

            //=============create city name element and display================//
            var cityName = $('<h2>');
            cityName.text(currentCity);
            currentConditions.append(cityName);

            //===============get date from results and display by appending to city name element==========//
            var currentCityDate = data.current.dt;
            currentCityDate = moment.unix(currentCityDate).format("MM/DD/YYYY");
            var currentDate = $('<span>');
            currentDate.text(` (${currentCityDate}) `);
            cityName.append(currentDate);

            //==================get weather icon and display by appending to city name element=======//            
            var currentCityWeatherIcon = data.current.weather[0].icon;
            var currentWeatherIcon = $('<img>');
            currentWeatherIcon.attr("src", "http://openweathermap.org/img/wn/" + currentCityWeatherIcon + ".png");
            cityName.append(currentWeatherIcon);

            //=============get current temp data and display================//
            var currentCityTemp = data.current.temp;
            var currentTemp = $('<p>')
            currentTemp.text(`Temp: ${currentCityTemp}°C`)
            currentConditions.append(currentTemp);

            //====================get current wind speed and display==============//
            var currentCityWind = data.current.wind_speed;
            var currentWind = $('<p>')
            currentWind.text(`Wind: ${currentCityWind} KPH`)
            currentConditions.append(currentWind);

            //============get current humidity and display================//
            var currentCityHumidity = data.current.humidity;
            var currentHumidity = $('<p>')
            currentHumidity.text(`Humidity: ${currentCityHumidity}%`)
            currentConditions.append(currentHumidity);

            //==============get current UV index, set background color based on level and display========//
            var currentCityUV = data.current.uvi;
            var currentUv = $('<p>');
            var currentUvSpan = $('<span>');
            currentUv.append(currentUvSpan);

            currentUvSpan.text(`UV: ${currentCityUV}`)

            if (currentCityUV < 3) {
                currentUvSpan.css({ 'background-color': 'green', 'color': 'white' });
            } else if (currentCityUV < 6) {
                currentUvSpan.css({ 'background-color': 'yellow', 'color': 'black' });
            } else if (currentCityUV < 8) {
                currentUvSpan.css({ 'background-color': 'orange', 'color': 'white' });
            } else if (currentCityUV < 11) {
                currentUvSpan.css({ 'background-color': 'red', 'color': 'white' });
            } else {
                currentUvSpan.css({ 'background-color': 'violet', 'color': 'white' });
            }

            currentConditions.append(currentUv);


            //=========5 - Day Forecast	 for selected area==============//
            // create 5 Day Forecast <h2> header	
            var fiveDayForecastHeader = $('#fiveDayForecastHeader');
            var fiveDayHeader = $('<h2>');
            fiveDayHeader.text('5-Day Forecast:');
            fiveDayForecastHeader.append(fiveDayHeader);
            var fiveDayForecast = $('#fiveDayForecast');
            // get key weather info from API data for five day forecast and display	
            for (var i = 1; i <= 5; i++) {
                var date;
                var temp;
                var icon;
                var wind;
                var humidity;
                date = data.daily[i].dt;
                date = moment.unix(date).format("MM/DD/YYYY");
                temp = data.daily[i].temp.day;
                icon = data.daily[i].weather[0].icon;
                wind = data.daily[i].wind_speed;
                humidity = data.daily[i].humidity;
                // create a card	
                var card = document.createElement('div');
                card.classList.add('card', 'col-2', 'm-1', 'bg-secondary', 'text-white');

                // create card body and append	
                var cardBody = document.createElement('div');
                cardBody.classList.add('card-body');
                cardBody.innerHTML = `<h6>${date}</h6>	
                                      <img src= "http://openweathermap.org/img/wn/${icon}.png"> </><br>	
                                       ${temp}°C<br>	
                                       ${wind} KPH <br>	
                                       ${humidity}%`

                card.appendChild(cardBody);
                fiveDayForecast.append(card);
            }

        })
    return;
}


//===========Display search history as buttons=============//
function displaySearchHistory() {
    var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
    var pastSearches = document.getElementById('past-searches');
    pastSearches.innerHTML = '';
    for (i = 0; i < storedCities.length; i++) {

        var pastCityBtn = document.createElement("button");
        pastCityBtn.classList.add("btn", "btn-dark", "my-2", "past-city");
        pastCityBtn.setAttribute("style", "width: 100%");
        pastCityBtn.textContent = `${storedCities[i].city}`;
        pastSearches.appendChild(pastCityBtn);
    }
    return;
}



//===use Open Weather 'Current weather data (API)' to get city coordinates to then send to 'One Call API' to get weather====//
function getCoordinates() {
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${APIkey}`;
    var storedCities = JSON.parse(localStorage.getItem("cities")) || [];

    fetch(requestUrl)
        .then(function (response) {
            if (response.status >= 200 && response.status <= 299) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(function (data) {

            var cityInfo = {
                city: currentCity,
                lon: data.coord.lon,
                lat: data.coord.lat
            }

            storedCities.push(cityInfo);
            localStorage.setItem("cities", JSON.stringify(storedCities));



            return cityInfo;
        })
        .then(function (data) {
            getWeather(data);
        })
    return;
}

//========handle requst to clear past search history============//
function handleClearHistory(event) {
    event.preventDefault();
    var pastSearches = document.getElementById('past-searches');
    localStorage.removeItem("cities");
    pastSearches.innerHTML = '';
    return;
}






function clearCurrentCityWeather() {
    var currentConditions = document.getElementById("currentConditions");
    currentConditions.innerHTML = '';

    var fiveDayForecastHeader = document.getElementById("fiveDayForecastHeader");
    fiveDayForecastHeader.innerHTML = '';

    var fiveDayForecast = document.getElementById("fiveDayForecast");
    fiveDayForecast.innerHTML = '';


    return;
}

//=======clear previously displayed weather details==========//
function handleCityFormSubmit(event) {
    event.preventDefault();
    currentCity = cityInput.val().trim();

    clearCurrentCityWeather();
    getCoordinates();

    return;
}
// When user clicks on city previously searched, an updated forecast will be retrieved and displayed	
function getPastCity(event) {
    var element = event.target;
    if (element.matches(".past-city")) {
        currentCity = element.textContent;

        clearCurrentCityWeather();
        var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${APIkey}`;

        fetch(requestUrl)
            .then(function (response) {
                if (response.status >= 200 && response.status <= 299) {
                    return response.json();
                } else {
                    throw Error(response.statusText);
                }
            })
            .then(function (data) {
                var cityInfo = {
                    city: currentCity,
                    lon: data.coord.lon,
                    lat: data.coord.lat
                }
                return cityInfo;
            })
            .then(function (data) {
                getWeather(data);
            })
    }
    return;
}
displaySearchHistory();


searchBtn.on("click", handleCityFormSubmit);
clearBtn.on("click", handleClearHistory);
pastSearchedCities.on("click", getPastCity);