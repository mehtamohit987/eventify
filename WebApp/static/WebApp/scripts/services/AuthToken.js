'use strict';

angular.module('eventify')
  .factory('AuthToken', function($http, $rootScope) {
            var service = [];
            
            service.host = '172.16.64.128';
            service.port = '8000';

            service.loggedIn = false;
            service.authToken = null;
            service.validity = null;
            service.user_id = null;

            service.fav_events =  null;



            service.generate_token = function(x,y){
              
                if(x!=null&&x!=''&&x!=' '&& y!=null&&y!=''&&y!=' ')
                {       
                    
                    
                    var url = "http://" + service.host + ":" + service.port +"/api/user/auth-token/?email=" + String(x) + "&password=" + String(y);

                    $http.get(url)
                        .success(function(data){
                            
                            if('token' in data && data['token']!= null){

                                service.loggedIn=true;
                                service.authToken= String(data['token']);
                                service.validity =  (new Date( ( new Date() ).getTime() + (24*60*60*1000) )).getTime() ;
                                
                                var url_id = "http://" + service.host + ":" + service.port +"/api/user/getuserid";
                                var req = {
                                method: 'GET',
                                 url: url_id,
                                 headers: {
                                   'Authorization': 'Token ' + String(service.authToken)
                                 }
                                }

                                $http(req)
                                    .then(function(data){
                                        service.user_id = data.data.results;
                                        service.set_local_storage();     
                                    }
                                    ,
                                    function(data){
                                        console.log("Couldn't get user id")
                                    }
                                    );

                                $rootScope.$broadcast("authSuccess");
                                $(function () {
                                    $('.close').trigger("click");
                                });


                                service.set_local_storage();
                            }
                            else{
                                console.log("error");
                                service.loggedIn = false;
                                service.authToken = null;
                                service.validity = null;
                            }
                                        
                    })  
                    .error(function(data){
                        service.loggedIn=false;
                        service.authToken = null;
                    });
                }


            };

            service.unset_local_storage = function(){

                if (typeof(Storage) != "undefined") {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("validity");
                    if(localStorage.hasOwnProperty('user_id'))
                        localStorage.removeItem("user_id");
                }


            };


            service.get_local_storage = function(){
                if (typeof(Storage) != "undefined" && localStorage.hasOwnProperty('authToken') && localStorage.hasOwnProperty('validity')) {
                    
                    var valid = parseInt(localStorage.getItem("validity"));

                    if( valid > (new Date()).getTime() ){
                        
                        service.authToken = localStorage.getItem("authToken");
                        service.validity = valid;
                        service.loggedIn = true;
                        if(localStorage.hasOwnProperty('user_id'))
                            service.user_id = localStorage.getItem("user_id");

                        return true;
                    }
                    else{
                        service.unset_local_storage();
                    }

                    return false;
                }

            };



            service.unsetEverything = function(){
                service.unset_local_storage();
                service.loggedIn = false;
                service.authToken = null;
                service.validity = null;
                service.user_id = null;
                $rootScope.$broadcast("logOut");
            };

            service.set_local_storage = function(){

                if (typeof(Storage) != "undefined") {

                    localStorage.setItem("authToken", service.authToken);
                    localStorage.setItem("validity", service.validity);
                    if (service.user_id != null) localStorage.setItem("user_id", service.user_id);
                }
            };


            service.get_token = function(){

                if (service.authToken != null){

                    if( service.validity  > (new Date()) )
                        return service.authToken;
                    else
                        return null

                }

                if(service.get_local_storage()==true){
                    service.loggedIn = true;
                    return service.authToken;
                }

            };

            service.generate_fav_event_list = function(){

                if (service.user_id== null || service.user_id == '' || service.authToken==null || service.authToken=='') {service.fav_events=null; return;}
                                
                var url = "http://" + service.host + ":" + service.port +"/api/user/" + String(service.user_id) + "/favouritearraylist";
                var req = {
                method: 'GET',
                 url: url,
                 headers: {
                   'Authorization': 'Token ' + String(service.authToken)
                 }
                }

                $http(req)
                    .then(function(data){
                        service.fav_events = data.data.results;
                        $rootScope.$broadcast("favListGenerated");
                    }
                    ,
                    function(data){
                        console.log("Couldn't retrieve user favourites fromm api");
                        service.fav_events=null;
                    }
                    );
            };



            service.roundit = function(x,y){
                return Math.round(x*Math.pow(10,y)) / Math.pow(10,y);
            };
      

            service.generate_user_id = function(){
                var url_id = "http://" + service.host + ":" + service.port +"/api/user/getuserid";
                var req = {
                method: 'GET',
                 url: url_id,
                 headers: {
                   'Authorization': 'Token ' + String(service.authToken)
                 }
                }

                $http(req)
                    .then(function(data){
                        service.user_id = data.data.results;
                        service.set_local_storage();     
                    }
                    ,
                    function(data){
                        console.log("Couldn't get user id of current user");
                    }
                );
            };
            
            service.get_user_id = function(){
                if(service.user_id==null)
                    service.generate_user_id();
                return service.user_id;
            };

            service.get_fav_event_list = function(){
                if(service.fav_events==null)
                    service.generate_fav_event_list();
                
                if(service.fav_events!=null){
                    return service.fav_events;

                }
                else
                    return [];
            };

        

            return service;
    });