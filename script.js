// Global variables
var citySearch = document.getElementById("citySearch"),
    searchHistory = [],
    today = moment().format("M" + "/" + "D" + "/" + "YYYY"),
    APIKey = "a908941a600765cd93c1943bfd3be4b7",
    city;

// Function to take an input (city) and render the entire page
function searchWeather(city) {

    for (var i = 0; i <= 4; i++) {
        $("#day" + i).empty();
    }

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + APIKey;

    // Main AJAX function to get most of the necessary detials for the website 
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        var lat = parseFloat(response.coord.lat);
        var lon = parseFloat(response.coord.lon);
        var cityID = response.id;

        var weatherImg = 'https://openweathermap.org/img/wn/' + response.weather[0].icon + '.png';
        $("#city").html(city + " (" + today + ") " + "<img src=" + weatherImg + "> </img>");

        var temp = parseFloat(response.main.temp).toFixed(1);
        $("#temp").html("Current Temperature: " + temp + "<span>&deg</span> F");

        var humidity = parseInt(response.main.humidity);
        $("#humidity").html("Current Humidity: " + humidity + "%");

        var windSpeed = parseFloat(response.wind.speed).toFixed(1);
        $("#windSpeed").html("Current Wind Speed: " + windSpeed + " MPH");

        queryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon + "&cnt=5";

        // Second AJAX function to get the UV Index data for the website and color code it based on wikipedia seriousness of UV Index
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            if (response[0].value <= 3) {
                var uvIndexSpan = $("<span>").attr("id", "uvIndexLow").addClass("box").html(reponse[0].value);
                $("#uvIndex").html("Current UV Index: ").append(uvIndexSpan);
            }
            else if (response[0].value > 3 && response[0].value <= 6) {
                var uvIndexSpan = $("<span>").attr("id", "uvIndexModerate").addClass("box").html(response[0].value);
                $("#uvIndex").html("Current UV Index: ").append(uvIndexSpan);
            }
            else if (response[0].value > 6 && response[0].value <= 8) {
                var uvIndexSpan = $("<span>").attr("id", "uvIndexHigh").addClass("box").html(response[0].value);
                $("#uvIndex").html("Current UV Index: ").append(uvIndexSpan);
            }
            else if (response[0].value > 8 && response[0].value <= 10) {
                var uvIndexSpan = $("<span>").attr("id", "uvIndexVeryHigh").addClass("box").html(response[0].value);
                $("#uvIndex").html("Current UV Index: ").append(uvIndexSpan);
            }
            else if (response[0].value > 10) {
                var uvIndexSpan = $("<span>").attr("id", "uvIndexExtreme").addClass("box").html(response[0].value);
                $("#uvIndex").html("Current UV Index: ").append(uvIndexSpan);
            }
        })

        queryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&units=imperial" + "&appid=" + APIKey;

        // Third AJAX function to create the forecast part of the page
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
           
            $("#forecastH5").removeClass("d-none");


            for (var i = 0; i <= 4; i++) {

                // Have to define r because the response pulls a 5 day forecast but in 3 hour increments 
                var r = (i + 1) * 7;

                $("<h6>").html(moment().add(i + 1, "days").format("M" + "/" + "D" + "/" + "YYYY")).appendTo("#day" + i);

                $("#day" + i).removeClass("d-none");

                weatherImg = 'https://openweathermap.org/img/wn/' + response.list[r].weather[0].icon + '@2x.png'
                var forecastWeatherImg = $("<img>").attr("src", weatherImg);

                var forecastTemp = $("<p>").html("Temp: " + parseFloat(response.list[r].main.temp).toFixed(2) + "<span>&deg</span> F");

                var forecastHumidity = $("<p>").html("Humidity: " + parseInt(response.list[r].main.humidity) + "%");

                $("#day" + i).append(forecastWeatherImg, forecastTemp, forecastHumidity);

            }
        })
    })
}


function renderBtns() {
    for (var i = 0; i < searchHistory.length; i++) {
        var newCityDiv = $("<div>");
        var newCityBtn = $("<button>").addClass("cities").text(searchHistory[i]).appendTo(newCityDiv);
        $("#cityStorage").prepend(newCityBtn);
    }
}

function initSearch() {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (!searchHistory) {
        searchHistory = [];
    }
    else {
        renderBtns();
    }
}

$("#searchBtn").on("click", function () {
    city = citySearch.value;
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    var newCityDiv = $("<div>");
    var newCityBtn = $("<button>").addClass("cities").text(city).appendTo(newCityDiv);
    $("#cityStorage").prepend(newCityBtn);

    searchWeather(city);
});

$(document).on("click", ".cities", function () {
    city = $(this).html();

    searchWeather(city);
});

initSearch(); 