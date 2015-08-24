(function(){


    var eventify = angular.module("eventify");

    eventify.controller('searchController', function ($scope, $http, $routeParams) {

        var host =  'localhost';
        var port = '8000';
		
        $scope.events = []
    
        $scope.numFound = 0
        $scope.searching = false
        $scope.prevExists = null
        $scope.nextExists = null
        $scope.currentPage = 0;


        ///////
        $scope.loggedIn=true;
        ///////
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
        	console.log('hamse kaise ho paega - be optimistic')

            x = titleQuery;
           
            if(x!=null&&x!=''&&x!=' ')
            {       

                y = ((selected_time_range==null||selected_time_range=="") ? '': '&time_start=' + date[selected_time_range]['time_start'] + '&time_end=' + date[selected_time_range]['time_end'])

                z = ((selected_country==null||selected_country=="") ? '': '&country=' + selected_country)

                c = ((coordinates==null||coordinates=="") ? '' : '&latitude=' + String(roundit(coordinates['latitude'], 6)) + '&longitude=' + String(roundit(coordinates['longitude'], 6)) );
                

                var url = (p==0 ? "http://" + host + ":" + port +"/api/events/?q=" + String(x) + z + y + c : ( p==-1? $scope.prevExists : $scope.nextExists )  )

                // window.location.assign('search');
                $http.get(url)
                    .success(function(data){
                        console.log(data)

                        $scope.events = data.results;

                        angular.forEach($scope.events, function(ev, key){
                            ev['is'] = false;
                            //traverse fav and check which fav-ed
                            console.log(ev.num_fav)
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