(function(){


    var eventify = angular.module("eventify");
console.log('aaaa')
    eventify.controller('homeController', function ($scope, $http) {

        var host = '172.16.65.209'; //'localhost';
        var port = '8000';
        $scope.events = []
        
        $scope.numFound = 0
        console.log('aaaa')
        var coordinates = null;
        $scope.$on('locationHit',function(event, args){
            
            coordinates = args.coordinates;
            console.log(coordinates)
            // renderContent();
        });


			//ToDo: integrate location var and pagination

        var renderContent = function(){
        	console.log('hamse kaise ho paega - be optimistic')

                c = ((coordinates==null||coordinates=="") ? '' : 'latitude=' + String(roundit(coordinates['latitude'], 6)) + '&longitude=' + String(roundit(coordinates['longitude'], 6)) + '&' );
                console.log(c);

                var url = "http://" + host + ":" + port +"/api/events/?"  + c + "sort=true"
                console.log(url);
                // window.location.assign('search');
                $http.get(url)
                    .success(function(data){
                        console.log(data)
            			console.log('hamse bilkul na ho paega')
                        $scope.events = data.results;
                                                    
                })
                .error(function(data){
                    console.log("error");
                    $scope.events = null;
                });
        }

       	renderContent()

      });

})();