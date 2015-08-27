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
        $scope.$on('logOut', function(event){
            $scope.loggedIn = false;
        });







        var run_assessment = function(){

            for (var i=0; i<$scope.events.length;i++){
                for(var j=0; j < $scope.fav_events_of_user.length; j++){
                    if (String($scope.events[i].id) == $scope.fav_events_of_user[j]['event_id']){
                        $scope.events[i]['is']=true;
                        $scope.events[i]['fav_id']=$scope.fav_events_of_user[j]['fav_id'];
                        break;
                    }
                    
                }
            }                    


        };



        $scope.$on('favListGenerated', function(event){
            $scope.fav_events_of_user = AuthToken.get_fav_event_list();
            run_assessment();
        });
        

        var renderContent = function(){

                c = ((coordinates==null||coordinates=="") ? '' : 'latitude=' + String(AuthToken.roundit(coordinates['latitude'], 6)) + '&longitude=' + String(AuthToken.roundit(coordinates['longitude'], 6)) + '&' );
                // console.log(c);

                var url = "http://" + AuthToken.host + ":" + AuthToken.port +"/api/events/?"  + c + "sort=true"
                console.log(url);
                // window.location.assign('search');
                $http.get(url)
                    .success(function(data){
                        console.log(data);
                        for(var i=0;i<data.results.length;i++)
                        {   
                            data.results[i]['is'] = false;
                            data.results[i]['fav_id'] = null;
                        }
                        $scope.events = data.results;

                        $scope.fav_events_of_user = AuthToken.get_fav_event_list();
                        if ($scope.loggedIn && $scope.fav_events_of_user!=null) run_assessment();


                                                    
                })
                .error(function(data){
                    console.log("error");
                    $scope.events = null;
                });
        }

        
        $scope.unfavourite = function($index, id){

 
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

            $scope.events[$index]['is'] = false;
            $scope.events[$index]['num_fav']--;

            $http(req);

            AuthToken.generate_fav_event_list();

        };

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
                    console.log(data);
                    console.log(data.data.id);
                    $scope.events[$index]['is'] = true;
                    $scope.events[$index]['num_fav']++;
                    $scope.events[$index]['fav_id'] = data.data.id;
                }
                ,
                function(data){
                    console.log("error");
                }
            );   

            AuthToken.generate_fav_event_list();

        };

       	renderContent();

      }]);

})();