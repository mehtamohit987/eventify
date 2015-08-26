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
        $scope.$on('logOut', function(event){
            $scope.loggedIn = false;
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



        $scope.favourite = function($index, id){

            if (id == null || $scope.loggedIn==false) return;
            var user_id = AuthToken.get_user_id();
            var authToken = AuthToken.get_token();
            if (user_id==null||authToken==null)return;

            var fav_url = "http://" + AuthToken.host + ":" + AuthToken.port +"/api/user/" + String(user_id) + "/favourite/";
            var req = {
             method: 'POST',
             url: fav_url,
             headers: {
               'Authorization': 'Token ' + String(authToken)
             },
             data: {fav_event: id} 
            }

            $http(req)
                .then(function(data){
                    $scope.favs[$index].fav_event['is'] = true;
                    $scope.favs[$index].fav_event['num_fav']++;
                }
                ,
                function(data){
                    console.log("error");
                }
            );   

        };
        
        $scope.unfavourite= function($index, id){

            if (id == null || $scope.loggedIn==false) return;
            var user_id = AuthToken.get_user_id();
            var authToken = AuthToken.get_token();
            if (user_id==null||authToken==null)return;

            var fav_url = "http://" + AuthToken.host + ":" + AuthToken.port +"/api/user/" + String(user_id) + "/favourite/" + String(id);
            var req = {
             method: 'DELETE',
             url: fav_url,
             headers: {
               'Authorization': 'Token ' + String(authToken)
             }
            }
            $scope.favs[$index].fav_event['is'] = false;
            $scope.favs[$index].fav_event['num_fav']--;

            $http(req);

        };

        $scope.prevPage = function($event){

			renderContent(-1);
            $scope.currentPage --;
            window.scrollTo(0,0);
        };



        $scope.nextPage = function($event){

            renderContent(1)
            $scope.currentPage ++;
            window.scrollTo(0,0);
        };


        renderContent(0);





      }]);

})();