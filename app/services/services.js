
// Added this function as a quick fix for OpenWeatherMap's new requirement of an API key
function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/fccWeather/app/env/keys.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}


angular.module('myApp.services', [])
    .factory('weatherSvc', ['$http', function ($http) {
        'use strict';
        var apiKey;

        // Added this function as a quick fix for OpenWeatherMap's new requirement of an API key
        (function init(){
            loadJSON(function(response){
                apiKey = JSON.parse(response).openWeatherMap;
            });
        })();


        function rangeLimit(value, min, max) {
            value = (value >= min) ? value : min;
            value = (value <= max) ? value : max;
            return value;
        }

        var sdo = {
            query: function (lat, lon, refresh) {
                // validations
                refresh = refresh || false;
                // valid lat = -90...90
                // valid lon = -180...180
                lat = rangeLimit(lat, -90, 90);
                lon = rangeLimit(lon, -180, 180);

                var promise = $http({
                    method: 'GET',
                    url: 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + lat + '&lon=' + lon + '&mode=json' + '&APPID=' + apiKey
                });
                promise.success(function (data, status, headers, conf) {
                    return data;
                });
                return promise;
            }
        };
        return sdo;
    }]);


/*



 function ($http) {
 'use strict';
 var weatherCache = {};

 function rangeLimit(value, min, max) {
 value = (value >= min) ? value : min;
 value = (value <= max) ? value : max;
 return value;
 }

 function query(lat, lon, refresh) {
 // validations
 refresh = refresh || false;
 // valid lat = -90...90
 // valid lon = -180...180
 lat = rangeLimit(lat, -90, 90);
 lon = rangeLimit(lon, -180, 180);

 var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + lat + '&lon=' + lon + '&mode=json';

 // api promise call
 var promise = $http({
 method: 'GET',
 url: url
 });
 promise.success(function (data, status, headers, conf) {
 weatherCache[url] = data;
 return data;
 });
 return promise;

 return weatherCache[url];

 }

 return {query: query};
 })
 ;*/
