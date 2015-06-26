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

    .controller('View1Ctrl', ['$scope', '$animate', '$timeout', 'weatherData', function ($scope, $animate, $timeout, weatherData) {
        $scope.weatherData = weatherData.data;
        $scope.day = 0;
        $scope.tempMode = 'C';


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

        var activeImg = '.bgImgOne';
        var inactiveImg = '.bgImgTwo';
        $scope.bgOne = getBG($scope.day);
        $scope.bgTwo = getBG($scope.day);
        $scope.btnDisabled = false;


        var toggleImg = function() {
            if ($scope.btnDisabled) return;

            if (activeImg === '.bgImgOne') {
                $scope.bgTwo = getBG($scope.day);
            } else {
                $scope.bgOne = getBG($scope.day);
            }

            if ($scope.bgOne !== $scope.bgTwo) {
                $scope.btnDisabled = true;
                $animate.addClass(angular.element(activeImg), 'transparent', {});
                $animate.removeClass(angular.element(inactiveImg), 'transparent', {});

                var tmp = activeImg;
                activeImg = inactiveImg;
                inactiveImg = tmp;

                $timeout(function() {
                    $scope.btnDisabled = false;
                }, 1000);
            }
        };


        $scope.next = function () {
            if ($scope.btnDisabled) return;
            $scope.day = (++$scope.day < $scope.weatherData.list.length) ? $scope.day : $scope.weatherData.list.length - 1;
            toggleImg();
        };
        $scope.prev = function () {
            if ($scope.btnDisabled) return;
            $scope.day = (--$scope.day >= 0) ? $scope.day : 0;
            toggleImg();
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
                case 'C':
                    return kelvinToCelsius($scope.weatherData.list[day].temp.min);
                case 'K':
                    return $scope.weatherData.list[day].temp.min;
                case 'F':
                    return kelvinToFahrenheit($scope.weatherData.list[day].temp.min);
            }
        };
        $scope.tempMax = function (day, mode) {
            switch (mode) {
                case 'C':
                    return kelvinToCelsius($scope.weatherData.list[day].temp.max);
                case 'K':
                    return $scope.weatherData.list[day].temp.max;
                case 'F':
                    return kelvinToFahrenheit($scope.weatherData.list[day].temp.max);
            }
        };
        $scope.toTitleCase = function (str) {
            return str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        };

    }]);

