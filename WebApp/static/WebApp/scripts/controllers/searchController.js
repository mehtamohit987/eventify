(function(){


    var eventify = angular.module("eventify");

    eventify.controller('searchController',['$scope', '$http', '$routeParams', 'AuthToken', function ($scope, $http, $routeParams, AuthToken) {

        $scope.events = []
    
        $scope.numFound = 0
        $scope.searching = false
        $scope.prevExists = null
        $scope.nextExists = null
        $scope.currentPage = 0;

        $scope.fav_events_of_user = [];
        
        
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
        
        var page = 0, titleQuery = null, selected_time_range = null, date = null, coordinates = null, selected_country= null;


        $scope.$on('searchHit',function(event, args){

    	 	page = args.page;
            titleQuery = args.titleQuery;
            selected_time_range = args.selected_time_range;
            date = args.date;
            coordinates = args.coordinates;
            selected_country = args.selected_country;
            renderContent(page)

        });

        var renderContent = function(p){

            if(p==0) AuthToken.get_fav_event_list();
            x = titleQuery;
            window.scrollTo(0,0);
           
            if(x!=null&&x!=''&&x!=' ')
            {       

                y = ((selected_time_range==null||selected_time_range=="") ? '': '&time_start=' + date[selected_time_range]['time_start'] + '&time_end=' + date[selected_time_range]['time_end'])

                z = ((selected_country==null||selected_country=="") ? '': '&country=' + selected_country)

                c = ((coordinates==null||coordinates=="") ? '' : '&latitude=' + String(AuthToken.roundit(coordinates['latitude'], 6)) + '&longitude=' + String(AuthToken.roundit(coordinates['longitude'], 6)) );
                

                var url = (p==0 ? "http://" + AuthToken.host + ":" + AuthToken.port +"/api/events/?q=" + String(x) + z + y + c : ( p==-1? $scope.prevExists : $scope.nextExists )  )
                console.log(url);
                $http.get(url)
                    .success(function(data){

                        for(var i=0;i<data.results.length;i++)
                        {   
                            data.results[i]['is'] = false;
                            data.results[i]['fav_id'] = null;
                        }

                        console.log(data.results);

                        $scope.events = data.results;
                        $scope.fav_events_of_user = AuthToken.get_fav_event_list();
                        if ($scope.loggedIn && $scope.fav_events_of_user!=null) run_assessment();


                        $scope.prevExists = data['previous'];
                        $scope.nextExists = data['next'];
                        if (data.count == 0)
                        {    $scope.searching = false; $scope.currentPage = 0;}
                        else 
                        {
                            $scope.searching = true;
                            $scope.numFound = data.count;
                            if ($scope.currentPage==null || p==0) {$scope.currentPage = 1;}
                        }
                        
                })
                .error(function(data){
                    console.log("error");
                    $scope.events = null;
                    $scope.prevExists = null;
                    $scope.nextExists = null;
                    $scope.searching = false;
                    $scope.currentPage = 0;
                });
            }

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


        $scope.prevPage = function($event){
            renderContent(-1);
            $scope.currentPage --;
            if ($scope.loggedIn) run_assessment();
        };



        $scope.nextPage = function($event){
            renderContent(1)
            $scope.currentPage ++;
            if ($scope.loggedIn) run_assessment();
        };


      }]);

})();