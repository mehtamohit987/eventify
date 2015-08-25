'use strict';
var host =  '172.16.65.209'; //'localhost';//
var port = '8000';

angular.module('eventify')
  .service('AuthToken', function AuthToken($http) {
        var service = {
            'loggedIn': false,
            'authToken' : null,
            'user_id': null,
            'validity': null,
            'fav_events': [],
            

            'generate_token' : function(x,y){
              
                if(x!=null&&x!=''&&x!=' '&& y!=null&&y!=''&&y!=' ')
                {       
                    

                    var url = "http://" + host + ":" + port +"/api/user/auth-token/?email=" + String(x) + "&password=" + String(y);

                    $http.get(url)
                        .success(function(data){
                            if('token' in data && data['token']!= null){
                                this.loggedIn=true;
                                this.authToken= String(data['token']);
                                this.validity = new Date();
                                this.set_local_storage();
                            }
                            else{
                                console.log("error");
                                this.loggedIn=false;
                                this.authToken = null;
                                this.validity = null;
                            }
                                        
                    })  
                    .error(function(data){
                        this.loggedIn=false;
                        this.authToken = null;
                    });
                }


            },


            'get_local_storage':function(){
                if (typeof(Storage) != "undefined" && localStorage.hasOwnProperty('authToken') && localStorage.hasOwnProperty('validity')) {
                    
                    var valid = localStorage.getItem("validity");

                    if(Date(valid.getTime() + 24*60*60*1000)  > Date()){
                        
                        this.authToken = localStorage.getItem("authToken");
                        this.validity = localStorage.getItem("validity");
                        this.loggedIn = true;
                        if(localStorage.hasOwnProperty('user_id'))
                            this.user_id = localStorage.getItem("user_id");

                        return true;
                    }

                    return false;
                }

            },
            'set_local_storage':function(){

                if (typeof(Storage) != "undefined") {

                    localStorage.setItem("authToken", this.authToken);
                    localStorage.setItem("validity", this.validity);
                    if (this.user_id != null) localStorage.setItem("user_id", this.user_id);
                }


            },

            'get_user_id' : function(){
                
                
            },

            'get_token': function(){

                if (this.authToken != null){

                    if(Date(this.validity.getTime() + 24*60*60*1000)  > Date())
                        return this.authToken;
                    else
                        return null

                }

                if(this.get_local_storage()==true){
                    return this.authToken;
                }

            },

            'generate_fav_event' : function(){

                return fav_events;
            }

        };
        
        return service;
    });