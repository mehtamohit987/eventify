(function(){


    var eventify = angular.module("eventify");

    eventify.controller('myfavController', ['$scope', '$http', 'AuthToken', function ($scope, $http, AuthToken) {

        $scope.currentPage = 0;
        $scope.prevExists = null; 
        $scope.nextExists = null;
        $scope.favs = null;


        $scope.loggedIn = false;        
        if ( AuthToken.get_token() != null){
            $scope.loggedIn = true; 
        }
        $scope.$on('authSuccess',function(event){
            $scope.loggedIn = true;
        });



        var renderContent = function(p){                

        	x = AuthToken.get_user_id();
        	y = AuthToken.get_token();
            
            var url = (p==0 ? "http://" + AuthToken.host + ":" + AuthToken.port +"/api/user/" + String(x) + "/favourite" : ( p==-1? $scope.prevExists : $scope.nextExists )  )

            var req = {
			 method: 'GET',
			 url: url,
			 headers: {
			   'Authorization': 'Token ' + String(y)
			 }
			}

            $http(req)
                .then(function(data){
                    $scope.favs = data.data.results;

                    angular.forEach($scope.favs, function(fav, key){
                    	fav.fav_event['is'] = true;
                    });

                    $scope.prevExists = data.data['previous'];
                    $scope.nextExists = data.data['next'];
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