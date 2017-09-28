angular.module("app", []);
angular.module("app")
    .controller("formController", ['$scope', function($scope) {

    }])


angular.module("app")
    .controller("loginController", ['$scope', 'loginService', function($scope, loginService) {
        $scope.userName = "";
        $scope.password = "";
        $scope.res = "";
        $scope.login = function() {
            if ($scope.userName == "" || $scope.password == "") {
                $scope.res = "please enter valid credentials";
                return;
            }
            if ($scope.password.length < 2) {
                $scope.res = "please enter valid password";
                return;
            } else {
                loginService.login($scope.userName, $scope.password).then(function(data) {
                    console.log(data);
                }, function(err) {
                    console.log(err);
                })

            }

        }
        $scope.clear = function() {
            $scope.res = "";
        }

    }])
    .service("loginService", ['$http', '$q', function($http, $q) {
        this.login = function(name, password) {
            var text = {
                username: name,
                pass: password
            }
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: 'http://localhost:4000/login',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: text

            }).success(function(res) {
                defer.resolve(data);
            }).error(function(err) {
                defer.reject(err);
            })
            return defer.promise;
        }
    }])
    .controller('registerController', ['$scope', 'registerService', function($scope, registerService) {
        $scope.username = "";
        $scope.regNum = "";
        $scope.address = "";
        $scope.zip = "";
        $scope.res = "";
        $scope.password = "";
        $scope.res = "";
        $scope.mail = "";
        $scope.state = ["AK - Alaska",
            "AL - Alabama",
            "AR - Arkansas",
            "AS - American Samoa",
            "AZ - Arizona",
            "CA - California",
            "CO - Colorado",
            "CT - Connecticut",
            "DC - District of Columbia",
            "DE - Delaware",
            "FL - Florida",
            "GA - Georgia",
            "GU - Guam",
            "HI - Hawaii",
            "IA - Iowa",
            "ID - Idaho",
            "IL - Illinois",
            "IN - Indiana",
            "KS - Kansas",
            "KY - Kentucky",
            "LA - Louisiana",
            "MA - Massachusetts",
            "MD - Maryland",
            "ME - Maine",
            "MI - Michigan",
            "MN - Minnesota",
            "MO - Missouri",
            "MS - Mississippi",
            "MT - Montana",
            "NC - North Carolina",
            "ND - North Dakota",
            "NE - Nebraska",
            "NH - New Hampshire",
            "NJ - New Jersey",
            "NM - New Mexico",
            "NV - Nevada",
            "NY - New York",
            "OH - Ohio",
            "OK - Oklahoma",
            "OR - Oregon",
            "PA - Pennsylvania",
            "PR - Puerto Rico",
            "RI - Rhode Island",
            "SC - South Carolina",
            "SD - South Dakota",
            "TN - Tennessee",
            "TX - Texas",
            "UT - Utah",
            "VA - Virginia",
            "VI - Virgin Islands",
            "VT - Vermont",
            "WA - Washington",
            "WI - Wisconsin",
            "WV - West Virginia",
            "WY - Wyoming"
        ];
        $scope.states;
        $scope.city = "";


        $scope.verify = function() {
           
            if ($scope.password.length < 2) {
                $scope.res = "please enter valid password";
               
            }
            if ($scope.regNum.length < 7 || $scope.regNum.length > 7) {
                $scope.res = "please enter valid registration number // add code to verify reg number"
               
            }
            if ($scope.regNum == 7) {
                if (typeof $scope.regNum != number) {
                    $scope.res = "please enter valid registration number";
                   
                }

            }

            if ($scope.zip.length < 5 || $scope.zip.length > 5) {

                $scope.res = "please enter valid ZIP code";
            
            }

        }
        $scope.register = function() {
           
                 if ($scope.userName == "" || $scope.regNum == "" || $scope.mail == "" || $scope.password == "" || $scope.address == "" || $scope.city == "" ||$scope.states == "" || $scope.zip == "") {
                $scope.res = "please enter valid information";
                console.log($scope.userName,$scope.regNum, $scope.mail , $scope.password, $scope.address, $scope.city,$scope.states,  $scope.zip)
          return;
            }


                registerService.checkRegNum($scope.regNum).then(function(success) {
                    if(success === "0"){
                        reg();
                        return;
                    }else{
                         
                         $scope.res = "the registration number is already in use,  please try to login or contact customer services";
                         return;
                    }

                   

                }, function(err) {
                    $scope.res = "the server is busy.. please try again later"
                })

           

        }

        function reg() {
            addr = {
                street : $scope.address,
                city : $scope.city,
                state : $scope.states,
                zip : $scope.zip
            }
            registerService.register($scope.regNum, $scope.userName, $scope.password, addr, $scope.mail).then(function(success) {
                $scope.res = success;
            }, function(err) {
                $scope.res = err;
            })
        }
        $scope.clear = function() {
            $scope.res = "";
        }

    }])
angular.module("app")
    .service("registerService", ['$http', '$q', function($http, $q) {
        this.register = function(reg, name, pass, addrs, mail) {
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: 'http://localhost:4000/register',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {registration: reg, userName: name, password: pass, address: addrs, email: mail }

            }).success(function(res) {
                defer.resolve(res);
            }).error(function(err) {
                defer.reject(err);
            })
            return defer.promise;

        }

        this.checkRegNum = function(regNum) {
            var defer = $q.defer();
            $http({
                url: 'http://localhost:4000/checkReg',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { registration: regNum }
            }).success(function(res) {
                defer.resolve(res);
            }).error(function(err) {
                defer.reject(err);
            })
            return defer.promise;
        }
    }])