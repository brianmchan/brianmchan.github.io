$(document).ready(function() {
  getLocation();
});

var unitLabel;

function getLocation() {
  $.get("http://ipinfo.io", function(location) {
    $('#location').append(location.city + ", ").append(location.region);

    var units = getUnits(location.country);
    getWeather(location.loc, units);

  }, "jsonp");

}

function getWeather(loc, units) {
  lat = loc.split(",")[0]
  lon = loc.split(",")[1]

  var weatherApiUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + "&units=" + units + '&appid=e2db5b0453a25a492e87ad8b03046a7c';

  $.get(weatherApiUrl, function(weather) {
    var windDir = convertWindDirection(weather.wind.deg);
    var temperature = weather.main.temp;
    var humidity = weather.main.humidity;

    // label based in imperial vs metric units
    if (units === "imperial") {
      unitLabel = "F";
    } else {
      unitLabel = "C";
    }

    temperature = parseFloat((temperature).toFixed(1));

    $("#icon").append("<img src='http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png'>");
    $("#temp").append(temperature + " " + unitLabel);
    $("#conditions").append(weather.weather[0].description);
    $("#wind").append(windDir + " " + weather.wind.speed + " knots");
    $("#humidity").append(humidity);

  }, "jsonp");
};

function convertWindDirection(dir) {
  var rose = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  var eightPoint = Math.floor(dir / 45);
  return rose[eightPoint];
}

function getUnits(country) {
  var imperialCountries = ['US', 'BS', 'BZ', 'KY', 'PW'];

  if (imperialCountries.indexOf(country) === -1) {
    var units = "metric";
  } else {
    units = "imperial";
  }

  return units;
}

function celsiusToFahrenheit(temp) {
  return (temp * 1.8) + 32;
}

function fahrenheitToCelsius(temp) {
  return (temp - 32) * 5/9;
}

// change temperature to Fahrenheit or Celsius depending on what the temperature currently is
$("button").click(function() {
  var currentTemp = parseFloat($("#temp").text());
  var newTemp;

  if (unitLabel === "F") {
    newTemp = Math.round(fahrenheitToCelsius(currentTemp) * 10) / 10;
    unitLabel = "C";
  } else {
    newTemp = Math.round(celsiusToFahrenheit(currentTemp) * 10) / 10;
    unitLabel = "F";
  }

  $("#temp").text(newTemp + " " + unitLabel);
})