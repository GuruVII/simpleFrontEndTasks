(function($) {
var app = angular.module('app', ['infinite-scroll','ngMockE2E']);
    
    app.run(function($httpBackend) {
      var phones = [
          {name: 'phone1'}, 
          {name: 'phone2'}
      ];

      // returns the current list of phones
      $httpBackend.whenGET('/phones').respond(phones);

    });

    angular.module("app").factory("task6Factory", function($http) {
        var task6Factory = {
            partyList: function() {
                var promise = $http.get('/phones')
                    .then(function(response) {
                        //First function handles success
                        console.log("test response")
                        return response.data;
                    }, function(response) {
                        //Second function handles error
                        console.log("error in acquring phone list")
                    });
                return promise
            }
        };
        return task6Factory;
    });    
    
    app.controller('task6Controller', ['$scope', 'task6Factory', function ($scope, task6Factory) {   
        $scope.masterArray = [];
        task6Factory.partyList().then(function(successResponse) {
                    if (successResponse == undefined) {
                        console.log("undifines -.-")
                    };
                    $scope.masterArray = successResponse;
        });
}]);
})(jQuery); // end of jQuery name space