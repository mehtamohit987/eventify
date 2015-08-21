(function(){


    var eventify = angular.module("eventify");

    eventify.controller('mainController', ['$scope', '$http', function ($scope, $http) {

        var host =  'localhost';//'172.16.65.209'; //
        var port = '8000';

        var date = [];

        $scope.events = []
        $scope.countries = {"AD":"Andorra","AE":"United Arab Emirates","AF":"Afghanistan","AG":"Antigua and Barbuda","AI":"Anguilla","AL":"Albania","AM":"Armenia","AO":"Angola","AQ":"Antarctica","AR":"Argentina","AS":"American Samoa","AT":"Austria","AU":"Australia","AW":"Aruba","AX":"Åland","AZ":"Azerbaijan","BA":"Bosnia and Herzegovina","BB":"Barbados","BD":"Bangladesh","BE":"Belgium","BF":"Burkina Faso","BG":"Bulgaria","BH":"Bahrain","BI":"Burundi","BJ":"Benin","BL":"Saint Barthélemy","BM":"Bermuda","BN":"Brunei","BO":"Bolivia","BQ":"Bonaire","BR":"Brazil","BS":"Bahamas","BT":"Bhutan","BV":"Bouvet Island","BW":"Botswana","BY":"Belarus","BZ":"Belize","CA":"Canada","CC":"Cocos [Keeling] Islands","CD":"Democratic Republic of the Congo","CF":"Central African Republic","CG":"Republic of the Congo","CH":"Switzerland","CI":"Ivory Coast","CK":"Cook Islands","CL":"Chile","CM":"Cameroon","CN":"China","CO":"Colombia","CR":"Costa Rica","CU":"Cuba","CV":"Cape Verde","CW":"Curacao","CX":"Christmas Island","CY":"Cyprus","CZ":"Czechia","DE":"Germany","DJ":"Djibouti","DK":"Denmark","DM":"Dominica","DO":"Dominican Republic","DZ":"Algeria","EC":"Ecuador","EE":"Estonia","EG":"Egypt","EH":"Western Sahara","ER":"Eritrea","ES":"Spain","ET":"Ethiopia","FI":"Finland","FJ":"Fiji","FK":"Falkland Islands","FM":"Micronesia","FO":"Faroe Islands","FR":"France","GA":"Gabon","GB":"United Kingdom","GD":"Grenada","GE":"Georgia","GF":"French Guiana","GG":"Guernsey","GH":"Ghana","GI":"Gibraltar","GL":"Greenland","GM":"Gambia","GN":"Guinea","GP":"Guadeloupe","GQ":"Equatorial Guinea","GR":"Greece","GS":"South Georgia and the South Sandwich Islands","GT":"Guatemala","GU":"Guam","GW":"Guinea-Bissau","GY":"Guyana","HK":"Hong Kong","HM":"Heard Island and McDonald Islands","HN":"Honduras","HR":"Croatia","HT":"Haiti","HU":"Hungary","user_ID":"Indonesia","IE":"Ireland","IL":"Israel","IM":"Isle of Man","IN":"India","IO":"British Indian Ocean Territory","IQ":"Iraq","IR":"Iran","IS":"Iceland","IT":"Italy","JE":"Jersey","JM":"Jamaica","JO":"Jordan","JP":"Japan","KE":"Kenya","KG":"Kyrgyzstan","KH":"Cambodia","KI":"Kiribati","KM":"Comoros","KN":"Saint Kitts and Nevis","KP":"North Korea","KR":"South Korea","KW":"Kuwait","KY":"Cayman Islands","KZ":"Kazakhstan","LA":"Laos","LB":"Lebanon","LC":"Saint Lucia","LI":"Liechtenstein","LK":"Sri Lanka","LR":"Liberia","LS":"Lesotho","LT":"Lithuania","LU":"Luxembourg","LV":"Latvia","LY":"Libya","MA":"Morocco","MC":"Monaco","MD":"Moldova","ME":"Montenegro","MF":"Saint Martin","MG":"Madagascar","MH":"Marshall Islands","MK":"Macedonia","ML":"Mali","MM":"Myanmar [Burma]","MN":"Mongolia","MO":"Macao","MP":"Northern Mariana Islands","MQ":"Martinique","MR":"Mauritania","MS":"Montserrat","MT":"Malta","MU":"Mauritius","MV":"Maldives","MW":"Malawi","MX":"Mexico","MY":"Malaysia","MZ":"Mozambique","NA":"Namibia","NC":"New Caledonia","NE":"Niger","NF":"Norfolk Island","NG":"Nigeria","NI":"Nicaragua","NL":"Netherlands","NO":"Norway","NP":"Nepal","NR":"Nauru","NU":"Niue","NZ":"New Zealand","OM":"Oman","PA":"Panama","PE":"Peru","PF":"French Polynesia","PG":"Papua New Guinea","PH":"Philippines","PK":"Pakistan","PL":"Poland","PM":"Saint Pierre and Miquelon","PN":"Pitcairn Islands","PR":"Puerto Rico","PS":"Palestine","PT":"Portugal","PW":"Palau","PY":"Paraguay","QA":"Qatar","RE":"Réunion","RO":"Romania","RS":"Serbia","RU":"Russia","RW":"Rwanda","SA":"Saudi Arabia","SB":"Solomon Islands","SC":"Seychelles","SD":"Sudan","SE":"Sweden","SG":"Singapore","SH":"Saint Helena","SI":"Slovenia","SJ":"Svalbard and Jan Mayen","SK":"Slovakia","SL":"Sierra Leone","SM":"San Marino","SN":"Senegal","SO":"Somalia","SR":"Suriname","SS":"South Sudan","ST":"São Tomé and Príncipe","SV":"El Salvador","SX":"Sint Maarten","SY":"Syria","SZ":"Swaziland","TC":"Turks and Caicos Islands","TD":"Chad","TF":"French Southern Territories","TG":"Togo","TH":"Thailand","TJ":"Tajikistan","TK":"Tokelau","TL":"East Timor","TM":"Turkmenistan","TN":"Tunisia","TO":"Tonga","TR":"Turkey","TT":"Trinidad and Tobago","TV":"Tuvalu","TW":"Taiwan","TZ":"Tanzania","UA":"Ukraine","UG":"Uganda","UM":"U.S. Minor Outlying Islands","US":"United States","UY":"Uruguay","UZ":"Uzbekistan","VA":"Vatican City","VC":"Saint Vincent and the Grenadines","VE":"Venezuela","VG":"British Virgin Islands","VI":"U.S. Virgin Islands","VN":"Vietnam","VU":"Vanuatu","WF":"Wallis and Futuna","WS":"Samoa","XK":"Kosovo","YE":"Yemen","YT":"Mayotte","ZA":"South Africa","ZM":"Zambia","ZW":"Zimbabwe"}

        $scope.country_keys = Object.keys($scope.countries);
        $scope.selected_country = null
        $scope.options = [];
        $scope.coordinates = null;
        $scope.disableSearch = true;


        $scope.numFound = 0
        $scope.searching = false
        $scope.prevExists = null
        $scope.nextExists = null
        $scope.currentPage = 0;


        $scope.registered = false


        $scope.loggedIn = false
        $scope.authToken = null
        $scope.user_id = null

        if ($scope.authToken == null && typeof(Storage) != "undefined" && localStorage.hasOwnProperty('authToken')) {
            $scope.authToken = localStorage.getItem("authToken");
            $scope.loggedIn = true;
            if(localStorage.hasOwnProperty('user_id'))
                $scope.user_id = localStorage.getItem("authToken");
        }



        var roundit = function(x,y){
            return Math.round(x*Math.pow(10,y)) / Math.pow(10,y);
        };



        var renderDate = function(){


            date = [];
            var curr = new Date();
            var curr_stripped = (curr.toJSON()).substring(0,19);
            curr.setSeconds(curr.getSeconds() + 24*60*60);
            var midnight_stripped = (curr.toJSON()).substring(0,10) + "T00:00:00";
            date.push({time_start: curr_stripped , time_end: midnight_stripped});
            curr.setSeconds(curr.getSeconds() + 24*6*60*60);
            var next_week_stripped = (curr.toJSON()).substring(0,10) + "T00:00:00";
            date.push({time_start: curr_stripped , time_end: next_week_stripped});
            var curr = new Date();
            curr.setMonth(curr.getMonth()+1);
            var next_month_stripped = (curr.toJSON()).substring(0,10) + "T00:00:00";    
            date.push({time_start: curr_stripped , time_end: next_month_stripped});


        }



        var renderContent = function(p){


            x = $scope.titleQuery;
           
            if(x!=null&&x!=''&&x!=' ')
            {       

                y = (($scope.selected_time_range==null||$scope.selected_time_range=="") ? '': '&time_start=' + date[$scope.selected_time_range]['time_start'] + '&time_end=' + date[$scope.selected_time_range]['time_end'])

                z = (($scope.selected_country==null||$scope.selected_country=="") ? '': '&country=' + $scope.selected_country)

                c = (($scope.coordinates==null||$scope.coordinates=="") ? '' : '&latitude=' + String(roundit($scope.coordinates['latitude'], 6)) + '&longitude=' + String(roundit($scope.coordinates['longitude'], 6)) );
                

                var url = (p==0 ? "http://" + host + ":" + port +"/api/events/?q=" + String(x) + z + y + c : ( p==-1? $scope.prevExists : $scope.nextExists )  )

                $http.get(url)
                    .success(function(data){
            
                        $scope.events = data.results;
                        $scope.prevExists = data['previous'];
                        $scope.nextExists = data['next'];
                        if (data.count == 0)
                        {    $scope.searching = false; $scope.currentPage = 0;}
                        else 
                        {
                            $scope.searching = true;
                            $scope.numFound = data.count;
                            $scope.currentPage = 1;
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

            renderDate();
            renderContent(-1);

            $scope.currentPage --;
            console.log('prev_page')
        };



        $scope.nextPage = function($event){

            renderDate();
            renderContent(1)
            $scope.currentPage ++;
            console.log('next_page')
        };


        $scope.queryChanged = function() {
            if($scope.titleQuery==null||$scope.titleQuery==''){
                $scope.disableSearch = true;
            }
            else{
                $scope.disableSearch=false;
            }

        };

        $scope.location_button = function() {
            if($scope.coordinates!=null) {$scope.coordinates=null; return;}
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(pos){$scope.coordinates = pos['coords'];});
            }
        };

        $scope.search_button = function(){
            renderDate()
            renderContent(0)        
        };

        //user
        $scope.lmodel = {};
        $scope.rmodel = {};


        $scope.logout = function(){
            $scope.loggedIn = false;
            $scope.authToken = null;
            $scope.user_id = null;

            if (typeof(Storage) != "undefined") {
                localStorage.removeItem("user_id");
                localStorage.removeItem("authToken");
            }

        }

        $scope.login_button = function(){
            x = $scope.lmodel.email;
            y = $scope.lmodel.password;

            if(x!=null&&x!=''&&x!=' '&& y!=null&&y!=''&&y!=' ')
            {       
                

                var url = "http://" + host + ":" + port +"/api/user/auth-token/?email=" + String(x) + "&password=" + String(y);

                $http.get(url)
                    .success(function(data){
                        if('token' in data && data['token']!= null){
                            $scope.loggedIn=true;
                            $scope.authToken= String(data['token']);


                            if (typeof(Storage) != "undefined") {
                                localStorage.setItem("authToken", $scope.authToken);
                            }

                            $(function () {
                                $('.close').trigger("click");
                              });

                        }
                        else{
                            console.log("error");
                            $scope.loggedIn=false;
                            $scope.authToken = null;
                        }
                                    
                })  
                .error(function(data){
                    $scope.loggedIn=false;
                    $scope.authToken = null;

                    

                });
            }



        };

    //register

        $scope.register_button = function(){

            x = $scope.rmodel.email
            y = $scope.rmodel.password
            
            console.log( $scope.rmodel);
            console.log( $scope.rmodel.email);

            if(x!=null&&x!=''&&x!=' '&& y!=null&&y!=''&&y!=' ')
            {       
                
                var url = "http://" + host + ":" + port +"/api/user/"
                data = $scope.rmodel
                $http.post(url, data)
                    .success(function(data, status){
                  
                        if('id' in data && data['id']!= null){
                            
                            $scope.registered=true;
                            $scope.user_id= String(data['id']);


                            if (typeof(Storage) != "undefined") {
                                localStorage.setItem("user_id", $scope.user_id);
                            }

                            (function ($) {
                                $('.close').trigger("click");
                              })(jQuery);
                            window.setInterval(function(){$scope.registered=false;}, 2000);
                        }
                        else{
                            console.log("reg error");
                            $scope.registered=false;
                            $scope.user_id = null;
                        }
                                       
                })  
                .error(function(data){
                    $scope.registered=false;
                    $scope.user_id = null;
                });
            }
        };





      }]);

})();