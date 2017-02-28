(function($) {
    var app = angular.module('app', ['infinite-scroll', 'ngMockE2E'])

    app.run(function($httpBackend) {
        var allPhones = [];
        var allPhonesDesc = [];
        var perPage = 4;

        (function() {
            for (var i = 0; i < 101; i++) {
                var tempObject = {
                    name: "Phone " + (i + 1),
                    id: i,
                    url: "../images/3310"
                }
                allPhones.push(tempObject)
            }
            allPhonesDesc = allPhones.slice().reverse();
        })();
        
       
        
        // returns the current list of phones
        $httpBackend.whenGET(/\/phones\/(\d+)\/(\w+)/, undefined, ['page', 'order']).respond(function(method, url, data, headers, params) {
            var chosenPhones = [];
            var phonesArray;
            var page = parseInt(params.page, 10);
                
            console.log(params);
            if (params.order == "asc") {
                phonesArray = allPhones.slice();
            } else {
                phonesArray = allPhonesDesc.slice();
            };  
                
             if (page == 0){
                for (var i = page * perPage; i <  ((page * perPage)  + (perPage * 2)); i++) {     
                    chosenPhones.push(phonesArray[i]);   
                }
             } else {
                 for (var i = (page + 1) * perPage; i <  (page + 1) * perPage  + perPage; i++) {     
                    chosenPhones.push(phonesArray[i]);   
                    }
             };
             
            if (chosenPhones == null) {
                return [404, undefined, {}];
            }

            return [200, chosenPhones, {}];
        });
    });

    angular.module("app").factory("task6Factory", function($http) {
        var task6Factory = {
            phoneList: function(x) {
                var promise = $http.get('/phones/' + x.page + '/' + x.order)
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
        var isDone = false;
        //starting GET url information
        $scope.address = {
            page: 0,
            order: "asc"
        };
        $scope.loadData = function() {
            task6Factory.phoneList($scope.address).then(function(successResponse) {
                if (successResponse == undefined) {
                    console.log("Get failed")
                };
                $scope.masterArray = $scope.originalArray.concat(successResponse);
                $scope.originalArray = $scope.masterArray.slice();
                console.log("using GET we received the following array:")
                console.log(successResponse);
                infiniteArray()
                

            });

        };

        $scope.loadMore = function() {
            if (isDone) return;
            $scope.loadData();
            $scope.address.page += 1;
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
            for (var i = 1; i <= 4; i++) {
                //check if the element is undefined, then there is no more data and the fuction can stop
                var currentValue = $scope.masterArray[(x + i)];
                if (currentValue == undefined) {
                    console.log("it was unedefined")
                    isDone = true;
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
            isDone = false;
        };

        $scope.filterAscDesc = function() {
            resetArray()
            if ($scope.address.order == "desc") {

                $scope.address = {
                    page: 0,
                    order: "asc"
                };
                //I admit, I have no idea why, but this is the only way I found, I could get this to work
                $scope.loadMore(); 
                $scope.loadMore();
            } else {
                $scope.address = {
                    page: 0,
                    order: "desc"
                }
                $scope.loadMore();
                $scope.loadMore();
            }
        }
        $scope.loadMore();
    }]);
})(jQuery); // end of jQuery name space