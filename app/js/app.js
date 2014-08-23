'use strict';

var app = angular.module('groupAgentApp', ['facebook'])

  .config(function(FacebookProvider) {
     // Set your appId through the setAppId method or
     // use the shortcut in the initialize method directly.
     FacebookProvider.init('1459547414330035');
  })

  .controller('mainCtrl', function($scope, Facebook){
	 // Define user empty data :/
    $scope.user = {};

    // Defining user logged status
    $scope.logged = false;

  	$scope.$watch(
        function() {
          return Facebook.isReady();
        },
        function(newVal) {
          if (newVal)
            $scope.facebookReady = true;
        }
      );
  })

  .controller('authCtrl', function($scope, Facebook) {
	 /**
   * IntentLogin
   */
  $scope.IntentLogin = function() {
    Facebook.getLoginStatus(function(response) {
      if (response.status == 'connected') {
        $scope.logged = true;
        $scope.groups();
      }
      else
        $scope.login();
    });
  };

    $scope.login = function() {
      // From now on you can use the Facebook service just as Facebook api says
      Facebook.login(function(response) {
      });
    };

    /**
	   * Logout
	   */
	  $scope.logout = function() {
	    Facebook.logout(function() {
	      $scope.$apply(function() {
	        $scope.user   = {};
	        $scope.logged = false;
	      });
	    });
	  }

    $scope.getLoginStatus = function() {
      Facebook.getLoginStatus(function(response) {
        if(response.status === 'connected') {
          $scope.loggedIn = true;
        } else {
          $scope.loggedIn = false;
        }
      });
    };

    $scope.me = function() {
      Facebook.api('/me', function(response) {
        $scope.user = response;
      });
    };

    $scope.groups = function() {
      Facebook.api('/me/groups', function(response) {
        $scope.groups = response;
      });
    };
  });