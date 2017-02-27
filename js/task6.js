(function($) {
    var app = angular.module('app', ['infinite-scroll', 'ngMockE2E'])

    app.run(function($httpBackend) {
        var step = 0; //keeps track of how much of the array we've gone through
        var allPhones = [];
        var allPhonesDesc = [];

        (function() {
            for (var i = 0; i < 101; i++) {
                var tempObject = {
                    name: "Phone " + (i + 1),
                    id: i,
                    url: "../images/3310.jpg"
                }
                allPhones.push(tempObject)
            }
            allPhonesDesc = allPhones.slice().reverse();
        })();

        // returns the current list of phones
        $httpBackend.whenGET(/\/phones\/(\d+)\/(\d+)/, undefined, ['id', 'order']).respond(function(method, url, data, headers, params) {
            var chosenPhones = [];
            var phonesArray;
            console.log(params);
            if (params.order == 1) {
                phonesArray = allPhones.slice();
            } else {
                phonesArray = allPhonesDesc.slice();
            };
            if ((params.id - step) < 0) { //filtering causes the result to be negative and give incorrect results
                step = 0;
            };
            console.log("difference is: ")
            console.log(params.id - step)


            for (step; step < params.id; step++) {
                chosenPhones.push(phonesArray[step]);
            };
            console.log(chosenPhones)
            step = params.id;
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
        $scope.data = [];
        //starting GET url information
        $scope.address = {
            id: 8,
            order: 1
        };
        $scope.loadData = function() {
            $scope.loading = true;
            task6Factory.phoneList($scope.address).then(function(successResponse) {
                if (successResponse == undefined) {
                    console.log("Get failed")
                };
                $scope.masterArray = $scope.originalArray.concat(successResponse);
                $scope.originalArray = $scope.masterArray.slice();
                infiniteArray()


            });
            $scope.loading = false;

        };

        $scope.loadMore = function() {
            $scope.loadData();
            $scope.address.id += 4;
        };

        //this function slowly serves data from the masterArray
        function infiniteArray() {
            var last = [];
            var x
            console.log($scope.data.length)
            if ($scope.data.length == 0) {
                x = -1
            } else {
                x = $scope.data.length - 1;
            }
            console.log($scope.masterArray[0])
            for (var i = 1; i <= 4; i++) {
                //check if the element is undefined, then there is no more data and the fuction can stop
                var currentValue = $scope.masterArray[(x + i)];
                if (currentValue == undefined) {
                    console.log("it was unedefined")
                    return
                } else {
                    $scope.data.push(currentValue);
                }
            };

        }

        function resetArray() {
            $scope.masterArray = [];
            $scope.originalArray = [];
            $scope.data = [];
        };

        $scope.filterAscDesc = function() {
            resetArray()
            if ($scope.address.order == 1) {

                $scope.address = {
                    id: 4,
                    order: 2
                };
                $scope.loadData()
            } else {
                $scope.address = {
                    id: 4,
                    order: 1
                }
                $scope.loadData()
            }
        }
        $scope.loadMore();
    }]);
})(jQuery); // end of jQuery name space