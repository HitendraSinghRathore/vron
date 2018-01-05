angular.module('starter.controllers', [])

//--------------------------------------------------------------------------------------------------------------------------------------------

.factory('userData', function() {
    return {};
})

//--------------------------------------------------------------------------------------------------------------------------------------------

.factory('data', function() {
    return {};
})

//--------------------------------------------------------------------------------------------------------------------------------------------


.factory("mapData", function($rootScope) {
    var scope = $rootScope.$new(true);
    scope.data = { track: "false", arrray: [] };
    return scope;
})

// .factory('mapData', function() {
//     track = false;
//     array = [];
//     return { track, array };
// })

//--------------------------------------------------------------------------------------------------------------------------------------------
.controller('driverCtrl', function($firebaseArray, data, $scope) {
    ctrl = this;

    var driverRef = firebase.database().ref('Users').child('Driver');
    ctrl.drivers = $firebaseArray(driverRef);
    console.log(ctrl.drivers);

    $scope.$on('$ionicView.beforeEnter',
        function() {
            // Code here is always executed when entering this state
            ctrl.drivers.$loaded()
                .then(function(x) {
                    console.log(ctrl.drivers.length);
                    for (var i = 0; i < ctrl.drivers.length; i++) {
                        if (ctrl.drivers[i].name == data.driver) {
                            ctrl.driver = ctrl.drivers[i];
                            console.log(ctrl.driver);
                            break;
                        }
                    }
                });
        }
    );

})

//--------------------------------------------------------------------------------------------------------------------------------------------
.controller('MapCtrl', function($scope, $ionicModal, $state, NgMap, data, userData, $window) {

    ctrl = this;




    if ($window.localStorage.getItem("token") !== null && $window.localStorage.getItem("token") !== "") {

        var data = JSON.parse($window.localStorage.getItem("token"));
        console.log(data);
        userData.user = data.user;
        userData.mode = data.mode;
    }

    $ionicModal.fromTemplateUrl('templates/showBuses.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    ctrl.myEvent = function() {
        $scope.modal.show();
    };
    console.log("IN MAIN");

})

//--------------------------------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------------------------------

.controller('tabDriversCtrl', function($state, $firebaseArray, data, $ionicPlatform) {
    ctrl = this;




    var driverRef = firebase.database().ref('Users').child('Driver');
    ctrl.drivers = $firebaseArray(driverRef);

    ctrl.showDriver = function(name) {
        console.log(name);
        data.driver = name;
        console.log(data.driver);
        $state.go("driver");
    }

})

//--------------------------------------------------------------------------------------------------------------------------------------------
.controller('showBusesCtrl', function($firebaseArray) {
    ctrl = this;
    console.log("IN");
    var busRef = firebase.database().ref('Buses');
    ctrl.buses = $firebaseArray(busRef);

})

//--------------------------------------------------------------------------------------------------------------------------------------------
.controller('ProfileCtrl', function($scope, $window, $state, userData, $ionicPlatform, $firebaseAuth) {
    ctrl = this;



    console.log(userData);
    ctrl.email = userData.user.email;
    ctrl.id = userData.user.id;
    ctrl.name = userData.user.name;
    ctrl.year = userData.user.year;

    ctrl.signOut = function() {
        $window.localStorage.setItem("token", "");
        var auth = $firebaseAuth();
        auth.$signOut();
        $state.go("signIn");
        location.reload();
    }

})


//--------------------------------------------------------------------------------------------------------------------------------------------

.controller('SignInCtrl', function($scope, $timeout, $state, $firebaseArray, $firebaseAuth, $ionicLoading, $ionicPopup, $cordovaNetwork, $window, userData) {





    if ($window.localStorage.getItem("token") !== null && $window.localStorage.getItem("token") !== "") {

        var data = JSON.parse($window.localStorage.getItem("token"));
        console.log(data);

        userData.user = data.user;
        userData.mode = data.mode;
        if (data.mode == "Student")
            $state.go("tab.map");
        else
            $state.go("driverTab.driverMap");


    }

    ctrl = this;
    var auth = $firebaseAuth();
    ctrl.error = false;

    document.addEventListener("deviceready", function() {
        if ($cordovaNetwork.isOffline()) {

            var confirmPopup = $ionicPopup.confirm({
                title: 'Data Connection',
                template: 'Data Connection Not ON. Do you want to retry'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    console.log('You retried');
                    location.reload();
                } else {
                    console.log('You Exited');
                    navigator.app.exitApp();
                }
            });
        }
    }, false);

    $scope.show = function() {
        $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner icon="lines"></ion-spinner>'
        });
    };

    $scope.hide = function() {
        $ionicLoading.hide();
    };
    ctrl.errorStmt = "";
    ctrl.signIn = function() {
        if (ctrl.signInForm.email.$valid && ctrl.signInForm.password.$valid && ctrl.signInForm.password.$dirty && ctrl.signInForm.email.$dirty) {
            console.log(ctrl.signInEmail);
            console.log(ctrl.signInForm.email.$dirty);
            console.log(ctrl.signInForm.password.$valid);
            console.log(ctrl.signInForm.password.$dirty);

            if (ctrl.signInEmail == "" && ctrl.signInForm.email.$valid) {
                ctrl.errorColor = "energized";
                ctrl.errorStmt = "Enter Email";
                console.log("In 1");
                ctrl.error = true;
                $timeout(function() {
                    console.log("timeout over");
                    ctrl.error = false;
                }, 3000);
            } else if (ctrl.signInPassword == "" && ctrl.signInForm.password.$valid) {
                ctrl.errorColor = "energized";
                ctrl.errorStmt = "Enter Password";
                console.log("In 2");
                ctrl.error = true;
                $timeout(function() {
                    console.log("timeout over");
                    ctrl.error = false;
                }, 3000);
            } else {

                var promise = auth.$signInWithEmailAndPassword(ctrl.signInEmail, ctrl.signInPassword);

                $scope.show($ionicLoading);

                promise
                    .then(function(firebaseUser) {
                        console.log(firebaseUser);
                        //$scope.hide($ionicLoading);
                        // userData.isLive = true;
                        // ctrl.isLive = userData.isLive;

                        var Ref = firebase.database().ref('Users').child('Student');
                        var students = $firebaseArray(Ref);



                        // Code here is always executed when entering this state
                        students.$loaded()
                            .then(function(x) {
                                console.log(students.length);
                                console.log(students);
                                for (var i = 0; i < students.length; i++) {
                                    console.log(students[i]);
                                    if (students[i].email == firebaseUser.email) {

                                        userData.user = students[i];
                                        userData.mode = "Student";
                                        console.log(ctrl.userData);
                                        $window.localStorage.setItem("token", JSON.stringify(userData));
                                        ctrl.signInEmail = ctrl.signInPassword = "";
                                        $scope.hide($ionicLoading);
                                        $state.go("tab.map");
                                        break;
                                    }
                                }

                                if (userData.mode != "Student") {
                                    var driverRef = firebase.database().ref('Users').child('Driver');
                                    drivers = $firebaseArray(driverRef);
                                    console.log(drivers);


                                    // Code here is always executed when entering this state
                                    drivers.$loaded()
                                        .then(function(x) {
                                            console.log(drivers.length);
                                            for (var i = 0; i < drivers.length; i++) {
                                                console.log(drivers[i]);
                                                if (drivers[i].email == firebaseUser.email) {
                                                    //  userData = {};
                                                    userData.user = drivers[i];
                                                    userData.mode = "Driver";
                                                    console.log(userData);
                                                    $window.localStorage.setItem("token", JSON.stringify(userData));
                                                    ctrl.signInEmail = ctrl.signInPassword = "";
                                                    $scope.hide($ionicLoading);
                                                    $state.go("driverTab.driverMap");
                                                    break;
                                                }
                                            }
                                        });

                                }



                            });
                    })
                    .catch(function(error) {
                        $timeout(function() {
                            $scope.hide($ionicLoading);
                            ctrl.errorStmt = "Authentication Failed";
                            ctrl.errorColor = "assertive";
                            ctrl.error = true;
                            $timeout(function() {
                                console.log("timeout over");
                                ctrl.error = false;
                            }, 3000);
                        }, 2000);

                        console.error("Authentication failed:", error);
                    });
            }
        } else {
            ctrl.errorColor = "energized";
            console.log("Not In Form");
            console.log("Email:" + ctrl.signInEmail);
            ctrl.error = true;
            if (ctrl.signInForm.email.$pristine)
                ctrl.errorStmt = "Enter Email";
            else if (!ctrl.signInForm.email.$valid) {
                ctrl.errorStmt = "Enter Valid Email";
                console.log(ctrl.signInForm.email.$valid);
            } else
                ctrl.errorStmt = "Enter Password";


            $timeout(function() {
                console.log("timeout over");
                ctrl.error = false;
            }, 3000);

        }





    }

})


.controller('driverTabStudentCtrl', function($firebaseArray, userData, $ionicPlatform) {
    ctrl = this;




    var studentRef = firebase.database().ref('Users').child('Student');
    ctrl.databaseStudents = $firebaseArray(studentRef);

    ctrl.students = new Array();
    ctrl.databaseStudents.$loaded()
        .then(function(x) {
            for (var i = 0; i < ctrl.databaseStudents.length; i++) {
                if (ctrl.databaseStudents[i].busno.busNo == userData.user.busno.busNo) {
                    ctrl.students.push(ctrl.databaseStudents[i])
                }
            }
            console.log(userData);
        });
})


//--------------------------------------------------------------------------------------------------------------------------------------------
.controller('driverMapCtrl', function($cordovaGeolocation, $firebaseArray, userData, $ionicPopup, data, $window, /* mapData,*/ $scope) {
    ctrl = this;
    // ctrl.track = mapData.data.track;
    // ctrl.array = mapData.data.array;



    ctrl.track = false;
    ctrl.array = [];

    console.log(ctrl.track);

    var watchOptions = {
        timeout: 3000,
        enableHighAccuracy: false // may cause errors if true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);

    if ($window.localStorage.getItem("token") !== null && $window.localStorage.getItem("token") !== "") {

        var data = JSON.parse($window.localStorage.getItem("token"));
        console.log(data);

        userData.user = data.user;
        userData.mode = data.mode;
    }

    // var locRef = firebase.database().ref('Location').child(userData.user.busno.busNo);
    // var loc = $firebaseArray(locRef);




    var posOptions = { timeout: 10000, enableHighAccuracy: true };

    $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function(position) {

            ctrl.lat = position.coords.latitude;
            ctrl.long = position.coords.longitude;
        }, function(err) {
            console.log(err);
            console.log("GPS not On");
            var confirmPopup = $ionicPopup.confirm({
                title: 'GPS ERROR',
                template: ' GPS Not ON. Do you want to retry'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    console.log('You retried');
                    location.reload();
                } else {
                    console.log('You Exited');
                    navigator.app.exitApp();
                }
            });
        });

    ctrl.myEvent = function() {
        console.log("track");
        // mapData.data.track = true;
        //  console.log(mapData.track);
        ctrl.track = true;
        console.log(ctrl.track);
        //console.log(mapData.data.track);

        // $cordovaGeolocation
        //     .getCurrentPosition(posOptions)
        //     .then(function(position) {
        //         ctrl.lat = position.coords.latitude;
        //         ctrl.long = position.coords.longitude;
        //         mapData.array.push({ lat: ctrl.lat, lng: ctrl.long });
        ctrl.array.push({ lat: ctrl.lat, lng: ctrl.long });
        //         ctrl.array = mapData.array;
        //         console.log(ctrl.array);

        //     }, function(err) {});

        // mapData.array.push({ lat: ctrl.lat, lng: ctrl.long });
        //ctrl.array = mapData.array;

        watch.then(
            null,
            function(err) {
                // error
            },
            function(position) {
                // console.log("position change");
                ctrl.lat = position.coords.latitude;
                ctrl.long = position.coords.longitude;
                ctrl.array.pop();
                ctrl.array.push({ lat: ctrl.lat, lng: ctrl.long });
                // mapData.data.array.pop();
                // mapData.data.array.push({ lat: ctrl.lat, lng: ctrl.long });
                //ctrl.array = mapData.data.array;
                console.log(ctrl.array);
                // console.log(mapData.data.array);

            });
    }

    ctrl.closeEvent = function() {
        console.log("close");
        console.log("ctrl");
        console.log(ctrl.array);
        console.log(ctrl.track);
        console.log("MapData");
        // console.log(mapData.data.array);
        // console.log(mapData.data.track);

        watch.clearWatch();


        // mapData.data.track = false;
        ctrl.track = false;
        console.log(ctrl.track);
        // console.log(mapData.track);

        // mapData.data.array.pop();
        // ctrl.array = mapData.data.array;
        ctrl.array.pop();
        // console.log(ctrl.array);
    }
})


//--------------------------------------------------------------------------------------------------------------------------------------------
.controller('driverProfileCtrl', function($state, $window, userData, $ionicPlatform, $firebaseAuth) {
    ctrl = this;


    if ($window.localStorage.getItem("token") !== null && $window.localStorage.getItem("token") !== "") {

        var data = JSON.parse($window.localStorage.getItem("token"));
        console.log(data);

        userData.user = data.user;
        userData.mode = data.mode;
    }
    ctrl.name = userData.user.name;
    ctrl.email = userData.user.email;
    ctrl.phone = userData.user.phone;
    ctrl.id = userData.user.id;
    ctrl.signOut = function() {
        $window.localStorage.setItem("token", "");
        var auth = $firebaseAuth();
        auth.$signOut();
        $state.go("signIn");
        location.reload();
    }
})