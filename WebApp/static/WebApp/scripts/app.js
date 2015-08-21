(function(){

	var eventify = angular.module("eventify", ,['ngRoute']);

	eventify.config(['$routeProvider', 
	    function($routeProvider){

	        $routeProvider.

	        when('/',{

	            templateUrl: 'home',
	            controller: 'mainController'

	        }).
	        when('/search',{

	            templateUrl: 'search',
	            controller: 'searchController'

	        }).
	        when('/profile',{

	            templateUrl: 'profile',
	            controller: 'profileController'

	        }).
	        when('/myfav',{

	            templateUrl: 'myfav',
	            controller: 'myfavController'

	        }).
	        otherwise({

	            redirectTo: '/'

	        });


	    }]);


})();