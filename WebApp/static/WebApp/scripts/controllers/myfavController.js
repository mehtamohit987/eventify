(function(){


    var eventify = angular.module("eventify");

    eventify.controller('myfavController', ['$scope', '$http', function ($scope, $http) {

        var host =  'localhost';
        var port = '9000';

        $scope.currentPage = 0;
        $scope.prevExists = null;
        $scope.nextExists = null;
        $scope.favs = null

        var renderContent = function(p){                

            /////////
            $scope.loggedIn=true;
        	x = '55dcd3123472f91d8fa64d90';
        	y = '768402f8c74dbccdb61fd1d917926edc6d4a6c77ca1f';
            ////////
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
                    console.log(data.data.results);

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