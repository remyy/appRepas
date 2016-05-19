// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'firebase']);
var fb = null

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

      fb = new Firebase("https://vivid-heat-9662.firebaseio.com/");
  });
});

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'templates/signup.html',
            controller: 'SignupController'
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'templates/dashboard.html',
            controller: 'DashboardController'
        })
        .state('addrepas', {
            url: '/addrepas',
            templateUrl: 'templates/addrepas.html',
            controller: 'AddrepasController'
        });
    $urlRouterProvider.otherwise('/login');
});


app.controller("LoginController", function($scope, $firebaseAuth, $location) {

    $scope.login = function(email, password) {
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$authWithPassword({
            email: email,
            password: password
        }).then(function(authData) {
            $location.path("/dashboard");
        }).catch(function(error) {
            console.error("ERROR: " + error);
        });
    }

    

});

app.controller("SignupController", function($scope, $firebaseAuth, $location) {

$scope.register = function(username, email, password) {
    var fbAuth = $firebaseAuth(fb);
    fbAuth.$createUser({username: username, email: email, password: password}).then(function() {
        return fbAuth.$authWithPassword({
            username: username,
            email: email,
            password: password
        });
    }).then(function(authData) {
        $location.path("/dashboard");
    }).catch(function(error) {
        console.error("ERROR " + error);
    });
}

});

app.controller("DashboardController", function($scope, $firebaseObject, $ionicPopup) {

    $scope.list = function() {
        fbAuth = fb.getAuth();
        if(fbAuth) {
            var syncObject = $firebaseObject(fb.child("users/" + fbAuth.uid));
            syncObject.$bindTo($scope, "data");
        } 
    }

    $scope.create = function() {
        $ionicPopup.prompt({
            title: 'Enter a new TODO item',
            inputType: 'text'
        })
            .then(function(result) {
                if(result !== "") {
                    if($scope.data.hasOwnProperty("todos") !== true) {
                        $scope.data.todos = [];
                    }
                    $scope.data.todos.push({title: result});
                } else {
                    console.log("Action not completed");
                }
            });
    }

});
