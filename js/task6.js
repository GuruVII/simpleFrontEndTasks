(function($) {
    var app = angular.module('app', ['infinite-scroll', 'ngMockE2E'])

    app.run(function($httpBackend) {
        var step = 0; //keeps track of how much of the array we've gone through
        var allPhones = [];

        for (var i = 0; i < 100; i++) {
            var tempObject = {
                name: "Phone " + (i + 1),
                id: i,
                url: "../images/3310.jpg"
            }
            allPhones.push(tempObject)
        }

        // returns the current list of phones
        $httpBackend.whenGET(/\/phones\/(\d+)\/(\d+)/, undefined, ['id', 'order']).respond(function(method, url, data, headers, params) {
            var chosenPhones = [];
            var phonesArray;
            console.log(params);
            if (params.order == 1) {
                phonesArray = allPhones.slice();
            } else {
                phonesArray = allPhones.reverse().slice();
            }
            for (var i = step; i < params.id; i++) {
                chosenPhones.push(phonesArray[i]);
            };

            step = params.id;
            console.log(step);
            if (chosenPhones == null) {
                return [404, undefined, {}];
            }

            return [200, chosenPhones, {}];
        });
    });

    angular.module("app").factory("task6Factory", function($http) {
        var task6Factory = {
            phoneList: function(x) {
                var promise = $http.get('/phones/' + x.id + '/' + x.order)
                    .then(function(response) {
                        //First function handles success
                        console.log("test response")
                        return response.data;
                    }, function(response) {
                        //Second function handles error
                        console.log("error acquiring product list")
                    });
                return promise
            }
        };
        return task6Factory;
    });

    app.controller('task6Controller', ['$scope', 'task6Factory', function($scope, task6Factory) {
        $scope.masterArray = [];
        $scope.originalArray = [];
        $scope.data=[];
        //starting GET url information
        $scope.address = {
            id: 8,
            order: 1
        };
        $scope.loadData = function() {
            task6Factory.phoneList($scope.address).then(function(successResponse) {
                if (successResponse == undefined) {
                    console.log("Get failed")
                };
                $scope.masterArray = $scope.originalArray.concat(successResponse);
                $scope.originalArray = $scope.masterArray.slice();
                
                
                
            });
        };

        $scope.loadMore = function() {
            if ($scope.masterArray >= $scope.data){
                    infiniteArray()
                    $scope.address.id += 4;
                    $scope.loadData();
                  
            }               
        };

        //this function slowly serves data from the masterArray
        function infiniteArray() {
            var last = [];
            var x
            if ($scope.data.length == 0) {
                x = -1
            } else {
                x = $scope.data.length - 1;
            }

            for (var i = 1; i <= 4; i++) {
                //check if the element is undefined, then there is no more data and the fuction can stop
                var currentValue = $scope.masterArray[(x + i)];
                if (currentValue == undefined) {
                    return
                } else {
                    $scope.data.push(currentValue);
                }
            };
        }

    }]);
})(jQuery); // end of jQuery name space