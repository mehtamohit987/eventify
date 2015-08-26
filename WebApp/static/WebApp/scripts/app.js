(function(){

	var eventify = angular.module("eventify", ['ngRoute']);

	eventify.config(['$routeProvider', 
	    function($routeProvider){

	        $routeProvider.

	        when('/',{

	            templateUrl: '/static/WebApp/templates/home.html',
	            controller: 'homeController'

	        }).
	//         when('/search',{

	//             templateUrl: '/static/WebApp/templates/search.html',
	//             controller: 'searchController'

	//         }).
	//         when('/myprofile',{

	//             templateUrl: '/static/WebApp/templates/myprofile.html',
	//             controller: 'myprofileController'

	//         }).
	        when('/myfav',{

	            templateUrl: '/static/WebApp/templates/myfav.html',
	            controller: 'myfavController'

	        }).
	        otherwise({

	            redirectTo: '/'

	        });


	    }]);


})();