(function($) {
var app = angular.module('app', ['infinite-scroll','ngMockE2E']) 

app.run(function($httpBackend) {
    var step = 0; //keeps track of how much of the array we've gone through
    var allPhones = [];

    for (var i = 0; i < 100; i++){
        var tempObject = {
            name: "phone"+(i+1),
            id: i,
            url: "../images/3310.jpg"
        }
        allPhones.push(tempObject)
    }

        // returns the current list of phones
        $httpBackend.whenGET(/\/phones\/(\d+)\/(\d+)/, undefined, ['id','order']).respond(function(method, url, data, headers, params) {
            var chosenPhones =[];
            var phonesArray;
            console.log(params);
            if (params.order == 1){
                phonesArray = allPhones.slice();
            } else {
                phonesArray = allPhones.reverse().slice();                
            }
          for (var i = step; i < params.id; i++){
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
                var promise = $http.get('/phones/'+x.id+'/'+x.order)
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
    
    app.controller('task6Controller', ['$scope', 'task6Factory', function ($scope, task6Factory) {   
        $scope.masterArray = [];
        //starting GET url information
        $scope.address = {
            id: 8,
            order: 1
        };
        $scope.loadData = function(){
            task6Factory.phoneList($scope.address).then(function(successResponse) {
                        if (successResponse == undefined) {
                            console.log("Get failed")
                        };
                        $scope.masterArray = successResponse;
                console.log($scope.masterArray);
            });
        };
        
        $scope.loadData();
}]);
})(jQuery); // end of jQuery name space