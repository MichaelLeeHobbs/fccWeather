'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl',
            resolve: {
                weatherData: ['$q', 'weatherSvc', function ($q, weatherSvc) {
                    var deferred = $q.defer();

                    navigator.geolocation.getCurrentPosition(
                        deferred.resolve,
                        deferred.reject);

                    return deferred.promise.then(function (position) {
                            return weatherSvc.query(position.coords.latitude, position.coords.longitude);
                        }
                    );
                }]
            }
        });
    }])

    .controller('View1Ctrl', ['$scope', 'weatherData', function ($scope, weatherData) {
        $scope.weatherData = weatherData.data;
        $scope.day = 0;
        $scope.tempMode = 'c';


        // todo remove
        console.log($scope.weatherData);


        var getBG = function (day) {
            var id = $scope.weatherData.list[day].weather[0].id;

            // http://openweathermap.org/weather-conditions
            switch (true) {
                case (id >= 200 && id < 300):
                    return "https://static.pexels.com/photos/799/city-lights-night-clouds.jpg";
                case (id >= 300 && id < 400):
                    return "https://static.pexels.com/photos/1551/field-thunderstorm-rainy-meadow.jpg";
                case (id >= 500 && id < 600):
                    return "https://static.pexels.com/photos/639/clouds-rainy-rain-asia-large.jpg";
                case (id >= 600 && id < 700):
                    return "https://static.pexels.com/photos/374/snow-dawn-sunset-winter-large.jpg";
                case (id === 701):
                    return "https://static.pexels.com/photos/5052/road-fog-bend-foggy-large.jpg";
                case (id >= 702 && id < 800):
                    return "https://static.pexels.com/photos/4241/cold-snow-black-and-white-road-large.jpg";
                case (id === 800):
                    return "https://static.pexels.com/photos/180/wood-sea-landscape-nature-large.jpg";
                case (id >= 801 && id < 804):
                    return "https://static.pexels.com/photos/215/road-sky-clouds-cloudy.jpg";
                case (id >= 804 && id < 900):
                    return "https://static.pexels.com/photos/1679/sea-nature-beach-clouds-large.jpg";
                case (id === 900): // tornado
                    return "";
                case (id === 901):
                    return "https://static.pexels.com/photos/6648/sea-water-ocean-storm-large.jpg";
                case (id === 902):
                    return "https://static.pexels.com/photos/3927/storm-hotel-waves-windy-large.jpeg";
                case (id === 903):
                    return "https://static.pexels.com/photos/2969/climate-cold-glacier-iceberg-large.jpg";
                case (id === 904):
                    return "https://static.pexels.com/photos/607/sea-beach-sand-ocean-large.jpg";
                case (id === 905):
                    return "https://static.pexels.com/photos/1549/nature-fashion-person-red-large.jpg";
                case (id === 906):
                    return "https://static.pexels.com/photos/3935/cold-snow-black-and-white-train-large.jpeg";

                case (id === 951):
                    return "https://static.pexels.com/photos/6643/sea-dawn-sunset-cloudy-large.jpg";
                case (id >= 952 && id < 956):
                    return "https://static.pexels.com/photos/1206/person-woman-girl-blonde-large.jpg";
                case (id >= 956 && id < 960):
                    return "https://static.pexels.com/photos/2635/sea-beach-storm-tree-large.jpg";
                case (id >= 960 && id < 963):
                    return "https://static.pexels.com/photos/2271/clouds-cloudy-field-meadow-large.jpg";
            }
        };
        $scope.backGround = getBG($scope.day);

        $scope.next = function () {
            $scope.day = (++$scope.day < $scope.weatherData.list.length) ? $scope.day : $scope.weatherData.list.length - 1;
            $scope.backGround = getBG($scope.day);
        };
        $scope.prev = function () {
            $scope.day = (--$scope.day >= 0) ? $scope.day : 0;
            $scope.backGround = getBG($scope.day);
        };

        var kelvinToCelsius = function (k) {
            return k - 273.15;
        };
        var kelvinToFahrenheit = function (k) {
            return ((k - 273.15) * 9 / 5) + 32;
        };
        $scope.degToCompassDir = function (deg) {
            var dir = Math.round(deg / 45);

            switch (dir) {
                case 0:
                    return 'N';
                case 1:
                    return 'NE';
                case 2:
                    return 'E';
                case 3:
                    return 'SE';
                case 4:
                    return 'S';
                case 5:
                    return 'SW';
                case 6:
                    return 'W';
                case 7:
                    return 'NW';
                case 8:
                    return 'N';
            }
        };
        $scope.mpsToKph = function (mps) {
            return mps * 3.6;
        };
        $scope.tempMin = function (day, mode) {
            switch (mode) {
                case 'c':
                    return kelvinToCelsius($scope.weatherData.list[day].temp.min);
                case 'k':
                    return $scope.weatherData.list[day].temp.min;
                case 'f':
                    return kelvinToFahrenheit($scope.weatherData.list[day].temp.min);
            }
        };
        $scope.tempMax = function (day, mode) {
            switch (mode) {
                case 'c':
                    return kelvinToCelsius($scope.weatherData.list[day].temp.max);
                case 'k':
                    return $scope.weatherData.list[day].temp.max;
                case 'f':
                    return kelvinToFahrenheit($scope.weatherData.list[day].temp.max);
            }
        };
        $scope.toTitleCase = function (str) {
            return str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        };

    }]);