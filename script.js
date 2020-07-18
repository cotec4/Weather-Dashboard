var citySearch = document.getElementById("citySearch"),
    searchBtn = document.getElementById("searchBtn"),
    date = moment().format("M" + "/" + "D" + "/" + "YYYY");


function searchWeather() {

    var APIKey = "a908941a600765cd93c1943bfd3be4b7";
    var city = citySearch.value;
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        var lat = parseFloat(response.coord.lat);
        var lon = parseFloat(response.coord.lon);
        var cityID = response.id;

        var newCity = $("<div>").addClass("cities").text(city);
        $("#cityStorage").append(newCity);

        var weatherImg = 'https://openweathermap.org/img/wn/' + response.weather[0].icon + '.png';
        $("#city").html(city + " (" + date + ") " + "<img src=" + weatherImg + "> </img>");

        var temp = parseFloat(response.main.temp);
        temp = parseFloat(((temp - 273.15) * 1.8 + 32)).toFixed(1);
        $("#temp").html("Current Temperature: " + temp + "<span>&deg</span> F");

        var humidity = parseInt(response.main.humidity);
        $("#humidity").html("Current Humidity: " + humidity + "%");

        var windSpeed = parseFloat(response.wind.speed).toFixed(1);
        $("#windSpeed").html("Current Wind Speed: " + windSpeed + " MPH");

        queryURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon + "&cnt=5";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var uvIndex = response[0].value;
            if (uvIndex <= 3) {
                var uvIndexSpan = $("<span>").attr("id", "uvIndexLow").addClass("box").html(uvIndex);
                $("#uvIndex").html("Current UV Index: ").append(uvIndexSpan);
            }
            else if (uvIndex > 3 && uvIndex <= 6) {
                var uvIndexSpan = $("<span>").attr("id", "uvIndexModerate").addClass("box").html(uvIndex);
                $("#uvIndex").html("Current UV Index: ").append(uvIndexSpan);
            }
            else if (uvIndex > 6 && uvIndex <= 8) {
                var uvIndexSpan = $("<span>").attr("id", "uvIndexHigh").addClass("box").html(uvIndex);
                $("#uvIndex").html("Current UV Index: ").append(uvIndexSpan);
            }
            else if (uvIndex > 8 && uvIndex <= 10) {
                var uvIndexSpan = $("<span>").attr("id", "uvIndexVeryHigh").addClass("box").html(uvIndex);
                $("#uvIndex").html("Current UV Index: ").append(uvIndexSpan);
            }
            else if (uvIndex > 10) {
                var uvIndexSpan = $("<span>").attr("id", "uvIndexExtreme").addClass("box").html(uvIndex);
                $("#uvIndex").html("Current UV Index: ").append(uvIndexSpan);
            }
        })

        queryURL = "http://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            var day1 = response.list[0];
            var day2 = response.list[1];
            var day3 = response.list[2];
            var day4 = response.list[3];
            var day5 = response.list[4];

            console.log(day1.main);
            $("#day1")

            $("#day2")
            $("#day3")
            $("#day4")
            $("#day5")
        })
    })
}

$(searchBtn).on("click", searchWeather);