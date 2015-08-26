'use strict';
var host =  'localhost';//'172.16.65.209'; //
var port = '9000';

angular.module('eventify')
  .factory('AuthToken', function AuthToken($http, $rootScope) {
            var service = [];
            service.loggedIn = false;
            service.authToken = null;
            service.user_id = null;
            service.validity = null;
            service.fav_events =  [];


            service.page =  null;
            service.titleQuery = 'Default';//     titleQuery: $scope.titleQuery,
            service.selected_time_range = null; //     selected_time_range: $scope.selected_time_range,
            service.date = null; //     date: date,
            service.coordinates = null; //     coordinates: $scope.coordinates,
            service.selected_country = null; //     selected_country: $scope.selected_country


            service.updateTitleQuery = function(value){
                this.titleQuery = value;
                
                $rootScope.$broadcast("valuesUpdated");
                }
            
            service.updatePage = function(value){
                 this.page = value;
                 $rootScope.$broadcast("valuesUpdated");
                } 

            service.updateSelectedTimeRange = function(value){
                 this.selected_time_range = value;
                 $rootScope.$broadcast("valuesUpdated");
                }
            service.updateDate = function(value){
                 this.date = value;
                 $rootScope.$broadcast("valuesUpdated");
                }
            service.updateSelectedCountry = function(value){
                 this.selected_country = value;
                 $rootScope.$broadcast("valuesUpdated");
                }    
            service.updateCoordinates = function(value){
                 this.coordinates = value;
                 $rootScope.$broadcast("valuesUpdated");
                } 

            service.generate_token = function(x,y){
              
                if(x!=null&&x!=''&&x!=' '&& y!=null&&y!=''&&y!=' ')
                {       
                    
                    console.log(service.loggedIn);
                    var url = "http://" + host + ":" + port +"/api/user/auth-token/?email=" + String(x) + "&password=" + String(y);

                    $http.get(url)
                        .success(function(data){
                            console.log(url)
                            if('token' in data && data['token']!= null){
                                console.log(service.loggedIn);
                                service.loggedIn=true;
                                service.authToken= String(data['token']);
                                service.validity = new Date();
                                service.set_local_storage();
                            }
                            else{
                                console.log("error");
                                service.loggedIn=false;
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


            service.get_local_storage = function(){
                if (typeof(Storage) != "undefined" && localStorage.hasOwnProperty('authToken') && localStorage.hasOwnProperty('validity')) {
                    
                    var valid = localStorage.getItem("validity");

                    if(Date(valid.getTime() + 24*60*60*1000)  > Date()){
                        
                        service.authToken = localStorage.getItem("authToken");
                        service.validity = localStorage.getItem("validity");
                        service.loggedIn = true;
                        if(localStorage.hasOwnProperty('user_id'))
                            service.user_id = localStorage.getItem("user_id");

                        return true;
                    }

                    return false;
                }

            };

            service.set_local_storage = function(){

                if (typeof(Storage) != "undefined") {

                    localStorage.setItem("authToken", service.authToken);
                    localStorage.setItem("validity", service.validity);
                    if (service.user_id != null) localStorage.setItem("user_id", service.user_id);
                }


            };

            service.get_user_id = function(){
                
                
            };

            service.get_token = function(){

                if (service.authToken != null){

                    if(Date(service.validity.getTime() + 24*60*60*1000)  > Date())
                        return service.authToken;
                    else
                        return null

                }

                if(service.get_local_storage()==true){
                    return service.authToken;
                }

            };

            service.generate_fav_event = function(){

                return fav_events;
            };


            service.roundit = function(x,y){
                return Math.round(x*Math.pow(10,y)) / Math.pow(10,y);
            };

        

            return service;
    });