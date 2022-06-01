var APIkey = "27a9f332092005bcc51e13fb84d6b86f";

var cityInputEl = $('#city-input');
var searchBtn = $('#search-button');
var clearBtn = $('#clear-button');
var pastSearchedCities = $('#past-searches');

var currentCity;


//============use Open Weather 'One Call API' to get weather based on city coordinates============//
function getWeather(data) {

    var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.lat}&lon=${data.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${APIkey}`
    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {

            //==========current weather=======================//
            var currentConditions = $('#currentConditions');
            currentConditions.addClass('border border-dark');

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
            var currentWeatherIconEl = $('<img>');
            currentWeatherIconEl.attr("src", "http://openweathermap.org/img/wn/" + currentCityWeatherIcon + ".png");
            cityName.append(currentWeatherIconEl);

            //=============get current temp data and display================//
            var currentCityTemp = data.current.temp;
            var currentTempEl = $('<p>')
            currentTempEl.text(`Temp: ${currentCityTemp}°C`)
            currentConditions.append(currentTempEl);
            
            //====================get current wind speed and display==============//
            var currentCityWind = data.current.wind_speed;
            var currentWindEl = $('<p>')
            currentWindEl.text(`Wind: ${currentCityWind} KPH`)
            currentConditions.append(currentWindEl);

            //============get current humidity and display================//
            var currentCityHumidity = data.current.humidity;
            var currentHumidityEl = $('<p>')
            currentHumidityEl.text(`Humidity: ${currentCityHumidity}%`)
            currentConditions.append(currentHumidityEl);

            //==============get current UV index, set background color based on level and display========//
            var currentCityUV = data.current.uvi;
            var currentUvEl = $('<p>');
            var currentUvSpanEl = $('<span>');
            currentUvEl.append(currentUvSpanEl);

            currentUvSpanEl.text(`UV: ${currentCityUV}`)
            
            if ( currentCityUV < 3 ) {
                currentUvSpanEl.css({'background-color':'green', 'color':'white'});
            } else if ( currentCityUV < 6 ) {
                currentUvSpanEl.css({'background-color':'yellow', 'color':'black'});
            } else if ( currentCityUV < 8 ) {
                currentUvSpanEl.css({'background-color':'orange', 'color':'white'});
            } else if ( currentCityUV < 11 ) {
                currentUvSpanEl.css({'background-color':'red', 'color':'white'});
            } else {
                currentUvSpanEl.css({'background-color':'violet', 'color':'white'});
            }

            currentConditions.append(currentUvEl);

        })
    return;       
}














//===use Open Weather 'Current weather data (API)' to get city coordinates to then send to 'One Call API' to get weather====//
function getCoordinates () {
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
      .then(function(data) {
 
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










function clearCurrentCityWeather () {
    var currentConditions = document.getElementById("currentConditions");
    currentConditions.innerHTML = '';



    return;
}

//=======clear previously displayed weather details==========//
function handleCityFormSubmit (event) {
    event.preventDefault();
    currentCity = cityInputEl.val().trim();

    clearCurrentCityWeather();
    getCoordinates();

    return;
}

;

searchBtn.on("click", handleCityFormSubmit);
