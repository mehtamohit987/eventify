(function(){


    var eventify = angular.module("eventify");

    eventify.controller('searchController', function ($scope, $http, $routeParams) {

        $scope.events = []
    
        $scope.numFound = 0
        $scope.searching = false
        $scope.prevExists = null
        $scope.nextExists = null
        $scope.currentPage = 0;


        $scope.loggedIn=AuthToken.loggedIn;
        var user_id = AuthToken.user_id;
        var token = AuthToken.token;



        var fav_events_of_user = [];
        // var fav_on_this_page = {};


        if($scope.loggedIn==true){
         
            fav_list_url = 'http://' + AuthToken.host + ":" + AuthToken.port + "/api/user/" + user_id + "/favourite";

            var req = {
                method: 'GET',
                 url: fav_list_url,
                 headers: {
                   'Authorization': 'Token ' + String(token)
                 }
            }


            var next_page_fav_ex = true;

            var fav_events = function (){

                var next_fav = true;
                $http(req)
                    .then(function(data){
                        
                        angular.forEach(data.data.results, function(fav, key){
                            fav_events_of_user.push(fav.fav_event.id);
                        });

                        if (data.data.next == null ) {
                            next_fav = false; 
                            req['url'] = data.data.next;
                        }
                    }
                    ,
                    function(data){
                        console.log("error retrieving logged in user's favourites.");
                        next_fav = false;
                    }
                );

                return next_fav;
            };


            var next_fav = true;
            //while(next_page_fav_ex==true) {
                console.log(req);
                next_page_fav_ex = fav_events();
                console.log(next_page_fav_ex);
            //}

            console.log(fav_events_of_user);
        }



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
        	console.log('hamse ho paega - be optimistic')

            x = titleQuery;
           
            if(x!=null&&x!=''&&x!=' ')
            {       

                y = ((selected_time_range==null||selected_time_range=="") ? '': '&time_start=' + date[selected_time_range]['time_start'] + '&time_end=' + date[selected_time_range]['time_end'])

                z = ((selected_country==null||selected_country=="") ? '': '&country=' + selected_country)

                c = ((coordinates==null||coordinates=="") ? '' : '&latitude=' + String(AuthToken.roundit(coordinates['latitude'], 6)) + '&longitude=' + String(AuthToken.roundit(coordinates['longitude'], 6)) );
                

                var url = (p==0 ? "http://" + AuthToken.host + ":" + AuthToken.port +"/api/events/?q=" + String(x) + z + y + c : ( p==-1? $scope.prevExists : $scope.nextExists )  )
                console.log(url)
                // window.location.assign('#search');
                $http.get(url)
                    .success(function(data){
                        console.log(data)

                        $scope.events = data.results;

                        angular.forEach($scope.events, function(ev, key){
                            
                            if (ev.id in fav_events_of_user)
                                ev['is'] = true;
                            else
                                ev['is'] = false;

                            console.log(ev.num_fav);
                        });

                        
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



        $scope.unfavourite = function($index, event_id){

            var url = "http://" + AuthToken.host + ":" + AuthToken.port +"/api/user/" + String(user_id) + "/favourite/" + String(event_id) 
            console.log(url)
            console.log(event_id)
            var req = {
             method: 'DELETE',
             url: url,
             headers: {
               'Authorization': 'Token ' + String(token)
             }
            }
            console.log(req)
            $http(req)
                .then(function(data){
                    $scope.events[$index].num_fav--;
                    $scope.events[$index].is = true;                   
                }
                ,
                function(data){
                    console.log("error unfav-ing");
                    
                }
                );

        };

        $scope.favourite = function($index, event_id){


            var url = "http://" + AuthToken.host + ":" + AuthToken.port +"/api/user/" + String(user_id) + "/favourite/"
            console.log(url)
            console.log(event_id)
            data = {
                fav_event: String(event_id)
            }

            var req = {
             method: 'POST',
             url: url,
             headers: {
               'Authorization': 'Token ' + String(token)
             },
             data: data
            }

            $http(req)
                .then(function(data){
                    $scope.events[$index].num_fav++;
                    $scope.events[$index].is = true;
                }
                ,
                function(data){
                    console.log("error fav-ing");
                }
                );
        };


        $scope.prevPage = function($event){

            // renderDate();
            renderContent(-1);

            $scope.currentPage --;
            window.scrollTo(0,0);
            console.log('prev_page')
        };



        $scope.nextPage = function($event){

            // renderDate();
            renderContent(1)
            $scope.currentPage ++;
            window.scrollTo(0,0);
            console.log('next_page')
        };


        // $scope.search_button = function(){
        //     renderDate()
        //     renderContent(0)        
        // };







      });

})();