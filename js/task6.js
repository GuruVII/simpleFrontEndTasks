(function($) {
var app = angular.module('app', ['infinite-scroll','ngMockE2E', 'ngResource']);
    
    app.run(function($httpBackend) {
        var step = 0;
      var allPhones = [
          {    id: 0,
              name: 'phone1'}, 
          {     id: 1, 
              name: 'phone2'},
          {     id: 2, 
              name: 'phone3'},
          {     id: 3, 
              name: 'phone4'},
          {     id: 4, 
              name: 'phone5'},
          {     id: 5, 
              name: 'phone6'},
          {     id: 6, 
              name: 'phone7'},
          {     id: 7, 
              name: 'phone8'},         
          {     id: 8, 
              name: 'phone9'},
          {     id: 9, 
              name: 'phone10'},
          {     id: 10, 
              name: 'phone11'},
          {     id: 11, 
              name: 'phone12'},
          {     id: 12, 
              name: 'phone13'},
          {     id: 13, 
              name: 'phone14'},
          {     id: 14, 
              name: 'phone15'},
          {     id: 15, 
              name: 'phone16'},
          {     id: 16, 
              name: 'phone17'},
      ];
                
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
            phoneList: function(id, order) {
                var promise = $http.get('/phones/'+id+'/'+order)
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
        task6Factory.phoneList(8,2).then(function(successResponse) {
                    if (successResponse == undefined) {
                        console.log("Get failed")
                    };
                    $scope.masterArray = successResponse;
            console.log($scope.masterArray);
        });
}]);
})(jQuery); // end of jQuery name space