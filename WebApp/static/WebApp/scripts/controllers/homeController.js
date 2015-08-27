(function(){


    var eventify = angular.module("eventify");
    
    eventify.controller('homeController',['$scope','$http', 'AuthToken', function ($scope, $http, AuthToken) {

        $scope.events = []
        
        $scope.numFound = 0

        var coordinates = null;


        $scope.$on('locationHit',function(event, args){
            console.log("hit")
            coordinates = args.coordinates;
            console.log(coordinates)
            renderContent();
        });





        $scope.loggedIn = false;
        if ( AuthToken.get_token() != null){
            $scope.loggedIn = true; 
        }
        $scope.$on('authSuccess',function(event){
            $scope.loggedIn = true;
        });





			//ToDo: integrate location var and pagination

        var renderContent = function(){

                c = ((coordinates==null||coordinates=="") ? '' : 'latitude=' + String(AuthToken.roundit(coordinates['latitude'], 6)) + '&longitude=' + String(AuthToken.roundit(coordinates['longitude'], 6)) + '&' );
                // console.log(c);

                var url = "http://" + AuthToken.host + ":" + AuthToken.port +"/api/events/?"  + c + "sort=true"
                console.log(url);
                // window.location.assign('search');
                $http.get(url)
                    .success(function(data){
                        console.log(data)
            			console.log('home ka sman')
                        $scope.events = data.results;
                                                    
                })
                .error(function(data){
                    console.log("error");
                    $scope.events = null;
                });
        }

       	renderContent()

      }]);

})();