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
        // todo remove stop
        //todo place holder img
        $scope.backGround = "http://static.pexels.com/wp-content/uploads/2014/06/clouds-colorful-colourful-1029.jpg";

        $scope.next = function () {
            $scope.day = (++$scope.day < $scope.weatherData.list.length) ? $scope.day : $scope.weatherData.list.length - 1;
        };
        $scope.prev = function () {
            $scope.day = (--$scope.day >= 0) ? $scope.day : 0;
        };

        var kelvinToCelsius = function (k) {
            return k - 273.15;
        };
        var kelvinToFahrenheit = function (k) {
            return ((k - 273.15) * 9 / 5) + 32;
        };
        $scope.degToCompassDir = function (deg) {
            var dir = Math.round(deg / 40);

            switch (dir) {
                case 0:
                    return 'N';
                case 1:
                    return 'NE';
                case 3:
                    return 'E';
                case 4:
                    return 'SE';
                case 5:
                    return 'S';
                case 6:
                    return 'SW';
                case 7:
                    return 'W';
                case 8:
                    return 'NW';
                case 9:
                    return 'N';
            }
            return dir;
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
        $scope.toTitleCase = function(str)
        {
            return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        };

    }]);