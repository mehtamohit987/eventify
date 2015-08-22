(function(){


    var eventify = angular.module("eventify");

    eventify.controller('myfavController', ['$scope', '$http', function ($scope, $http) {

        var host =  'localhost';
        var port = '8000';

        $scope.currentPage = 0;
        $scope.prevExists = null;
        $scope.nextExists = null;
        $scope.favs = null

        var renderContent = function(p){                

        	x = '55d2b08aef931815214b27ba';
        	y = '76f875eda90f4cfe9c1b135df7b0aeb708f0c2e7f569';

            var url = (p==0 ? "http://" + host + ":" + port +"/api/user/" + String(x) + "/favourite" : ( p==-1? $scope.prevExists : $scope.nextExists )  )

            var req = {
			 method: 'GET',
			 url: url,
			 headers: {
			   'Authorization': 'Token ' + String(y)
			 }
			}

            $http(req)
                .then(function(data){
                    console.log(data)
                    $scope.favs = data.data.results;

                    angular.forEach($scope.favs, function(fav, key){
                    	fav.fav_event['is'] = true;
                    	console.log(fav);
                    });

                    $scope.prevExists = data['previous'];
                    $scope.nextExists = data['next'];
                    if (data.count == 0)
                    { $scope.currentPage = 0; }
                    else 
                    {
                        if ($scope.currentPage==null || p==0) {$scope.currentPage = 1;}
                    }
                    
                }
                ,
                function(data){
                    console.log("error");
                    $scope.events = null;
                    $scope.prevExists = null;
                    $scope.nextExists = null;
                    
                }
                );
        }





        $scope.prevPage = function($event){

			renderContent(-1);

            $scope.currentPage --;
            console.log('prev_page')
        };



        $scope.nextPage = function($event){

            // renderDate();
            renderContent(1)
            $scope.currentPage ++;
            console.log('next_page')
        };


        renderContent(0);





      }]);

})();