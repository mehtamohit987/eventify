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


        $scope.editting_profile = false;
        $scope.editting_password = false;

        $scope.profile = {};
        $scope.disableSubmit = false;
        

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



        $scope.Plocation_button = function() {
            // if($scope.coordinates!=null) {$scope.coordinates=null;}
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(pos){$scope.coordinates = pos['coords'];});
            }
            console.log($scope.coordinates);

        };
        console.log($scope.coordinates);


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

                    console.log(data.data.id);
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

        var editProfile = function(pass_upd){                
            var d={};
        	x = AuthToken.get_user_id();
        	y = AuthToken.get_token();
            

            if(pass_upd==true){
                d['password']=String(CryptoJS.MD5($scope.profile.password));
                console.log(String(d['password']));
            }
            else{


                console.log($scope.coordinates);
                var c = (($scope.coordinates==null||$scope.coordinates=="") ? '' : String(AuthToken.roundit($scope.coordinates['latitude'], 6)) + ', ' + String(AuthToken.roundit($scope.coordinates['longitude'], 6)) );
                console.log(c);
                // $scope.latitude = c.slice(11,19);
                // $scope.longitude = String(AuthToken.roundit($scope.coordinates['longitude'], 6));
                // console.log($scope.longitude);
                // console.log($scope.latitude);
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
                if( (c !='') )
                    d['coordinates']=c;

            }

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
                    console.log('suxxess')
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
        };

        
        
        $scope.profileSubmit = function(){
            console.log('sub prof' );
            editProfile($scope.editting_password);

            $scope.submitted = true;
            $scope.editting_profile = false;
            location.reload('http://'+AuthToken.host+':'+AuthToken.port+'/#/myprofile');
       };

        $scope.profileEdit_button = function(){
            $scope.editting_profile = true;
            $scope.editting_password = false;
        };

        $scope.passwordEdit_button = function(){
            $scope.editting_password = true;
            $scope.editting_profile = false;
        };

        $scope.pass_check = function(){
            if($scope.profile.password == $scope.profile.re_password)
                $scope.disableSubmit = false;
            else
                $scope.disableSubmit = true;

        };

        // $scope.editting = false;
        renderProfile();
        console.log($scope.email);

      }]);

})();