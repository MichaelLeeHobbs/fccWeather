'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl',
            resolve: {
                weatherData: ['$q', 'weatherSvc', function ($q, weatherSvc, options) {
                    var lat = 0;
                    var lon = 0;
                    var deferred = $q.defer();

                    navigator.geolocation.getCurrentPosition(
                        deferred.resolve,
                        deferred.reject,
                        options);

                    deferred.promise.then(function (position) {
                        var data = weatherSvc.query(position.coords.latitude, position.coords.longitude);
                    });
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
        console.log('test');
        console.log($scope.weatherData.city.name);
    }]);