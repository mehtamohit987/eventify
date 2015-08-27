(function(){


    var eventify = angular.module("eventify");

    eventify.controller('myprofileController', ['$scope', '$http', 'AuthToken', function ($scope, $http, AuthToken) {


        $scope.firstName = null;
        $scope.lastName = null;
        $scope.email = null;
        $scope.address = null;
        $scope.city = null;
        $scope.country = null;
        $scope.postal_code = null;
        $scope.coordinates = null;



        $scope.profile = {'fname':'', 'lname' : '', 'address':'', 'city': '', 'country': '', 'postal_code': '', 'coordinates' : ''}

        var d={};

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


        var renderProfile = function(){                

            x = AuthToken.get_user_id();
            y = AuthToken.get_token();
            
            var url = "http://" + AuthToken.host + ":" + AuthToken.port + "/api/user/" + String(x) 


            var req = {
             method: 'GET',
             url: url,
             headers: {
               'Authorization': 'Token ' + String(y)
             }
            }

            $http(req)
                .then(function(data){
                    $scope.profileDetail = data;

                    console.log(data.data.fname);

                    $scope.firstName = data.data.fname;
                    $scope.lastName = data.data.lname;
                    $scope.email = data.data.email;
                    $scope.address = data.data.address;
                    $scope.city = data.data.city;
                    $scope.country = data.data.country;
                    $scope.postal_code = data.data.postal_code;
                    $scope.coordinates = data.data.coordinates;
                    console.log($scope.email);
                 
                }
                ,
                function(data){
                    console.log("error");
                    // $scope.events = null;
                    // $scope.prevExists = null;
                    // $scope.nextExists = null;
                }
                );

                console.log($scope.lastName);
        }

        var editProfile = function(){                

        	x = AuthToken.get_user_id();
        	y = AuthToken.get_token();
            


            if( ($scope.profileDetail.data.fname != $scope.profile.fname) && ($scope.profile.fname !='') )
                d['fname']=$scope.profile.fname;
            if( ($scope.profileDetail.data.lname != $scope.profile.lname) && ($scope.profile.lname !='') )                
                d['lname']=$scope.profile.lname;
            if( ($scope.profileDetail.data.email != $scope.profile.email) && ($scope.profile.email !='') )
                d['email']=$scope.profile.email;
            if( ($scope.profileDetail.data.address != $scope.profile.address) && ($scope.profile.address!='') )
                d['address']=$scope.profile.address;
            if( ($scope.profileDetail.data.city != $scope.profile.city) && ($scope.profile.city !='') )
                d['city']=$scope.profile.city;
            if( ($scope.profileDetail.data.country != $scope.profile.country) && ($scope.profile.country !='') )
                d['country']=$scope.profile.country;
            if( ($scope.profileDetail.data.postal_code != $scope.profile.postal_code) && ($scope.profile.postal_code !='') )
                d['postal_code']=$scope.profile.postal_code;
            if( ($scope.profileDetail.data.coordinates != $scope.profile.coordinates) && ($scope.profile.coordinates !='') )
                d['coordinates']=$scope.profile.coordinates;

            var url = "http://" + AuthToken.host + ":" + AuthToken.port + "/api/user/" + String(x) 
            

            var req = {
			 method: 'PATCH',
			 url: url,
			 headers: {
			   'Authorization': 'Token ' + String(y)
			 },
             data: d
			}

            if (d != null ){
            $http(req)
                .then(function(data){
                    
                    // $scope.prevExists = data.data['previous'];
                    // $scope.nextExists = data.data['next'];
                    // if (data.count == 0)
                    // { $scope.currentPage = 0; }
                    // else 
                    // {
                    //     if ($scope.currentPage==null || p==0) {$scope.currentPage = 1;}
                    // }
                    
                }
                ,
                function(data){
                    console.log("error");
                    // $scope.events = null;
                    // $scope.prevExists = null;
                    // $scope.nextExists = null;
                }
                );

            }
        }

        
        
        $scope.profileSubmit = function(){
            console.log('sub prof' );
            editProfile();
            $scope.submitted = true;
            $scope.editting = false;
            window.open('http://'+AuthToken.host+':'+AuthToken.port+'/#/myprofile');
       };
        $scope.profileEdit_button = function(){
            $scope.editting = true;
        };

        $scope.profileChange = function(){


        };


        // $scope.editting = false;
        renderProfile();
        console.log($scope.email);

      }]);

})();