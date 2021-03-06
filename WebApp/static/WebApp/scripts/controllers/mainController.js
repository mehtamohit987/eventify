(function(){


    var eventify = angular.module("eventify");

    eventify.controller('mainController', ['$scope', '$http', '$location', 'AuthToken', function ($scope, $http, $location, AuthToken) {


        var date = [];
        $scope.countries = {"AD":"Andorra","AE":"United Arab Emirates","AF":"Afghanistan","AG":"Antigua and Barbuda","AI":"Anguilla","AL":"Albania","AM":"Armenia","AO":"Angola","AQ":"Antarctica","AR":"Argentina","AS":"American Samoa","AT":"Austria","AU":"Australia","AW":"Aruba","AX":"Åland","AZ":"Azerbaijan","BA":"Bosnia and Herzegovina","BB":"Barbados","BD":"Bangladesh","BE":"Belgium","BF":"Burkina Faso","BG":"Bulgaria","BH":"Bahrain","BI":"Burundi","BJ":"Benin","BL":"Saint Barthélemy","BM":"Bermuda","BN":"Brunei","BO":"Bolivia","BQ":"Bonaire","BR":"Brazil","BS":"Bahamas","BT":"Bhutan","BV":"Bouvet Island","BW":"Botswana","BY":"Belarus","BZ":"Belize","CA":"Canada","CC":"Cocos [Keeling] Islands","CD":"Democratic Republic of the Congo","CF":"Central African Republic","CG":"Republic of the Congo","CH":"Switzerland","CI":"Ivory Coast","CK":"Cook Islands","CL":"Chile","CM":"Cameroon","CN":"China","CO":"Colombia","CR":"Costa Rica","CU":"Cuba","CV":"Cape Verde","CW":"Curacao","CX":"Christmas Island","CY":"Cyprus","CZ":"Czechia","DE":"Germany","DJ":"Djibouti","DK":"Denmark","DM":"Dominica","DO":"Dominican Republic","DZ":"Algeria","EC":"Ecuador","EE":"Estonia","EG":"Egypt","EH":"Western Sahara","ER":"Eritrea","ES":"Spain","ET":"Ethiopia","FI":"Finland","FJ":"Fiji","FK":"Falkland Islands","FM":"Micronesia","FO":"Faroe Islands","FR":"France","GA":"Gabon","GB":"United Kingdom","GD":"Grenada","GE":"Georgia","GF":"French Guiana","GG":"Guernsey","GH":"Ghana","GI":"Gibraltar","GL":"Greenland","GM":"Gambia","GN":"Guinea","GP":"Guadeloupe","GQ":"Equatorial Guinea","GR":"Greece","GS":"South Georgia and the South Sandwich Islands","GT":"Guatemala","GU":"Guam","GW":"Guinea-Bissau","GY":"Guyana","HK":"Hong Kong","HM":"Heard Island and McDonald Islands","HN":"Honduras","HR":"Croatia","HT":"Haiti","HU":"Hungary","IDN":"Indonesia","IE":"Ireland","IL":"Israel","IM":"Isle of Man","IN":"India","IO":"British Indian Ocean Territory","IQ":"Iraq","IR":"Iran","IS":"Iceland","IT":"Italy","JE":"Jersey","JM":"Jamaica","JO":"Jordan","JP":"Japan","KE":"Kenya","KG":"Kyrgyzstan","KH":"Cambodia","KI":"Kiribati","KM":"Comoros","KN":"Saint Kitts and Nevis","KP":"North Korea","KR":"South Korea","KW":"Kuwait","KY":"Cayman Islands","KZ":"Kazakhstan","LA":"Laos","LB":"Lebanon","LC":"Saint Lucia","LI":"Liechtenstein","LK":"Sri Lanka","LR":"Liberia","LS":"Lesotho","LT":"Lithuania","LU":"Luxembourg","LV":"Latvia","LY":"Libya","MA":"Morocco","MC":"Monaco","MD":"Moldova","ME":"Montenegro","MF":"Saint Martin","MG":"Madagascar","MH":"Marshall Islands","MK":"Macedonia","ML":"Mali","MM":"Myanmar [Burma]","MN":"Mongolia","MO":"Macao","MP":"Northern Mariana Islands","MQ":"Martinique","MR":"Mauritania","MS":"Montserrat","MT":"Malta","MU":"Mauritius","MV":"Maldives","MW":"Malawi","MX":"Mexico","MY":"Malaysia","MZ":"Mozambique","NA":"Namibia","NC":"New Caledonia","NE":"Niger","NF":"Norfolk Island","NG":"Nigeria","NI":"Nicaragua","NL":"Netherlands","NO":"Norway","NP":"Nepal","NR":"Nauru","NU":"Niue","NZ":"New Zealand","OM":"Oman","PA":"Panama","PE":"Peru","PF":"French Polynesia","PG":"Papua New Guinea","PH":"Philippines","PK":"Pakistan","PL":"Poland","PM":"Saint Pierre and Miquelon","PN":"Pitcairn Islands","PR":"Puerto Rico","PS":"Palestine","PT":"Portugal","PW":"Palau","PY":"Paraguay","QA":"Qatar","RE":"Réunion","RO":"Romania","RS":"Serbia","RU":"Russia","RW":"Rwanda","SA":"Saudi Arabia","SB":"Solomon Islands","SC":"Seychelles","SD":"Sudan","SE":"Sweden","SG":"Singapore","SH":"Saint Helena","SI":"Slovenia","SJ":"Svalbard and Jan Mayen","SK":"Slovakia","SL":"Sierra Leone","SM":"San Marino","SN":"Senegal","SO":"Somalia","SR":"Suriname","SS":"South Sudan","ST":"São Tomé and Príncipe","SV":"El Salvador","SX":"Sint Maarten","SY":"Syria","SZ":"Swaziland","TC":"Turks and Caicos Islands","TD":"Chad","TF":"French Southern Territories","TG":"Togo","TH":"Thailand","TJ":"Tajikistan","TK":"Tokelau","TL":"East Timor","TM":"Turkmenistan","TN":"Tunisia","TO":"Tonga","TR":"Turkey","TT":"Trinidad and Tobago","TV":"Tuvalu","TW":"Taiwan","TZ":"Tanzania","UA":"Ukraine","UG":"Uganda","UM":"U.S. Minor Outlying Islands","US":"United States","UY":"Uruguay","UZ":"Uzbekistan","VA":"Vatican City","VC":"Saint Vincent and the Grenadines","VE":"Venezuela","VG":"British Virgin Islands","VI":"U.S. Virgin Islands","VN":"Vietnam","VU":"Vanuatu","WF":"Wallis and Futuna","WS":"Samoa","XK":"Kosovo","YE":"Yemen","YT":"Mayotte","ZA":"South Africa","ZM":"Zambia","ZW":"Zimbabwe"}

        $scope.country_keys = Object.keys($scope.countries);
        $scope.selected_country = null
        $scope.options = [];
        $scope.coordinates = null;
        $scope.disableSearch = true;
        $scope.autocompletelist = [];

        $scope.regEmailAvailable = true;

        $scope.registered = false;


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


        var search_button_pressed = false;


        


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

        };



        $scope.queryChanged = function() {

            if($scope.titleQuery==null||$scope.titleQuery==''){
                $scope.disableSearch = true;
                return;
            }
            else if(search_button_pressed){
                search_button_pressed = false;
                $location.url('/search');
            }
            else{
                $scope.disableSearch=false;
                $location.url('/search');
            }


            var url = "http://" + AuthToken.host + ":" + AuthToken.port +"/api/events/autocomplete?q=" + String($scope.titleQuery);

            $http.get(url)
                .success(function(data){
                    $scope.autocompletelist = data.results.slice(0,5);
                })
                .error(function(data){
                    $scope.autocompletelist = [];
                });



        };

        $scope.location_button = function() {
            if($scope.coordinates!=null) {$scope.coordinates=null; return;}
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(pos){$scope.coordinates = pos['coords'];});
            }

            $scope.$root.$broadcast("locationHit",{
                coordinates: $scope.coordinates
                
            });

        };

        $scope.search_button = function(){
            search_button_pressed = true
            $scope.queryChanged();
            renderDate();
            $scope.$root.$broadcast("searchHit",{

                page: 0,
                titleQuery: $scope.titleQuery,
                selected_time_range: $scope.selected_time_range,
                date: date,
                coordinates: $scope.coordinates,
                selected_country: $scope.selected_country
            });

        };


        $scope.get_email_availability = function(){
            $scope.regEmailAvailable = true;


            var url = "http://" + AuthToken.host + ":" + AuthToken.port +"/api/user/getemailavailability?q=" + String($scope.rmodel.email);

            $http.get(url)
                .success(function(data){
                    $scope.regEmailAvailable = data.result;
                })
                .error(function(data){
                    $scope.regEmailAvailable = true;  
                });

        };

        document.getElementById("titleQueryBox").addEventListener("click", $scope.queryChanged);


        $scope.lmodel = {};
        $scope.rmodel = {};


        $scope.logout = function(){
            $scope.loggedIn = false;
            AuthToken.unsetEverything();
        }

        $scope.login_button = function(){
            x = $scope.lmodel.email;
            y = String ( CryptoJS.MD5( $scope.lmodel.password ) ) ;
            AuthToken.generate_token(x,y);
        };


        $scope.register_button = function(){

            x = $scope.rmodel.email
            y = $scope.rmodel.password

            if(x!=null&&x!=''&&x!=' '&& y!=null&&y!=''&&y!=' ')
            {       
                
                var url = "http://" + AuthToken.host + ":" + AuthToken.port +"/api/user/"
                

                data = {
                        'email': $scope.rmodel.email,
                        'password': String( CryptoJS.MD5( $scope.rmodel.password ) ) 
                    }

                $http.post(url, data)
                    .success(function(data, status){
                  
                        if('id' in data && data['id']!= null){
                            
                            $scope.registered=true;

                            (function ($) {
                                $('.close').trigger("click");
                              })(jQuery);
                            window.setInterval(function(){$scope.registered=false;}, 750);
                        }
                        else{
                            console.log("reg error");
                            $scope.registered=false;
                        }
                                       
                })  
                .error(function(data){
                    $scope.registered=false;
                });
            }
        };



      }]);

})();