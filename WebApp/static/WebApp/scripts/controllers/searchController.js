(function(){


    var eventify = angular.module("eventify");

    eventify.controller('searchController', function ($scope, $http, $routeParams, AuthToken) {
        var search = this;
        var host =  'localhost';
        var port = '9000';
		
        $scope.events = []
    
        $scope.numFound = 0
        $scope.searching = false
        $scope.prevExists = null
        $scope.nextExists = null
        $scope.currentPage = 0;


        ///////
        $scope.loggedIn=true;
        ///////
        //var page = 0,  selected_time_range = null, date = null, coordinates = null, selected_country= null; //titleQuery = null,;


        // $scope.$on('searchHit',function(event, args){
        $scope.titleQuery = null;
        $scope.page = null;
        $scope.date = null;
        $scope.selected_country = null;
        $scope.selected_time_range = null;
        $scope.coordinates = null;

        $scope.$on('valuesUpdated', function() {
            $scope.titleQuery = AuthToken.titleQuery;
            $scope.page = AuthToken.page;
            $scope.date = AuthToken.date;
            $scope.selected_country = AuthToken.selected_country;
            $scope.selected_time_range = AuthToken.selected_time_range;
            $scope.coordinates = AuthToken.coordinates;
            console.log($scope.coordinates)




            
renderContent(0)



          });
        console.log($scope.page)
        console.log($scope.titleQuery)
        // });
            
        
        var renderContent = function(p){
            console.log('hamse kaise ho paega - be optimistic')

            x = $scope.titleQuery;
           
            if(x!=null&&x!=''&&x!=' ')
            {       

                y = (($scope.selected_time_range==null||$scope.selected_time_range=="") ? '': '&time_start=' + date[$scope.selected_time_range]['time_start'] + '&time_end=' + date[$scope.selected_time_range]['time_end'])

                z = (($scope.selected_country==null||$scope.selected_country=="") ? '': '&country=' + $scope.selected_country)

                c = (($scope.coordinates==null||$scope.coordinates=="") ? '' : '&latitude=' + String(AuthToken.roundit($scope.coordinates['latitude'], 6)) + '&longitude=' + String(AuthToken.roundit($scope.coordinates['longitude'], 6)) );
                

                var url = (p==0 ? "http://" + host + ":" + port +"/api/events/?q=" + String(x) + z + y + c : ( p==-1? $scope.prevExists : $scope.nextExists )  )
                console.log(url)
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

        };
        renderContent(0);

        // $scope.page = AuthToken.page;
        //search.titleQuery = AuthToken.titleQuery;
        // $scope.selected_time_range = AuthToken.selected_time_range;
        // date = AuthToken.date;
        // $scope.coordinates = AuthToken.coordinates;
        // $scope.selected_country = AuthToken.selected_country;
        console.log($scope.titleQuery)
        


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