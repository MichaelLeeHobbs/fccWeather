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
    }]);