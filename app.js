// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngMap', 'ion-floating-menu', 'firebase', 'ngCordova'])



.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

    });
})

.config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.navBar.alignTitle("center");
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    .state('driverTab', {
        url: '/driverTab',
        abstract: true,
        templateUrl: 'templates/driverTabs.html'
    })

    .state('driverTab.students', {
        url: '/students',
        views: {
            'driverTab-student': {
                templateUrl: 'templates/driverTab-student.html',
                controller: 'driverTabStudentCtrl',
                controllerAs: 'ctrl'
            }
        }
    })

    .state('driverTab.driverMap', {
        url: '/driverMap',
        views: {
            'driverTab-driverMap': {

                templateUrl: 'templates/driverTab-driverMap.html',
                controller: 'driverMapCtrl',
                controllerAs: 'ctrl'
            }
        }
    })

    .state('driverTab.driverProfile', {
        url: '/driverProfile',
        views: {
            'driverTab-driverProfile': {
                templateUrl: 'templates/driverTab-driverProfile.html',
                controller: 'driverProfileCtrl',
                controllerAs: 'ctrl'
            }
        }
    })

    .state('signIn', {
        url: '/signIn',
        templateUrl: 'templates/signIn.html',
        controller: 'SignInCtrl',
        controllerAs: 'ctrl',

    })

    .state('showBuses', {
        url: '/map/showBuses',
        templateUrl: 'templates/showBuses.html',
        controller: 'MapCtrl'
    })

    .state('tab.drivers', {
        url: '/drivers',
        views: {
            'tab-drivers': {
                templateUrl: 'templates/tab-drivers.html',
                controller: 'tabDriversCtrl',
                controllerAs: 'ctrl'
            }
        }
    })

    .state('tab.map', {
        url: '/map',
        views: {
            'tab-map': {
                templateUrl: 'templates/tab-map.html',
                controller: 'MapCtrl',
                controllerAs: 'ctrl'
            }
        }
    })

    .state('tab.profile', {
        url: '/profile',
        views: {
            'tab-profile': {
                templateUrl: 'templates/tab-profile.html',
                controller: 'ProfileCtrl',
                controllerAs: 'ctrl'
            }
        }
    })

    .state('driver', {
        url: '/driver',
        templateUrl: 'templates/driver.html',
        controller: 'driverCtrl',
        controllerAs: 'ctrl'
    });

    // .state('popover', {
    //     url: '/profile/popover',
    //     templateUrl: 'templates/popover.html',
    //     controller: 'ProfileCtrl'
    // });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('signIn');

});