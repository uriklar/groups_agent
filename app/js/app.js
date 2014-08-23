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
    $scope.groups = {};
    $scope.feed = [];
    $scope.query = "";

  	$scope.$watch(
        function() {
          return Facebook.isReady();
        },
        function(newVal) {
          if (newVal)
            $scope.facebookReady = true;

        }
      );

        $scope.me = function() {
          Facebook.api('/me', function(response) {
            $scope.user = response;
          });
        };

        $scope.myGroups = function() {
          Facebook.api('/me/groups', function(response) {
            $scope.groups = response.data;
          });
        };

        $scope.getGroupFeed = function(groupId) {
            $scope.feed = [];
            Facebook.api(groupId+'/feed', function(response) { recursiveGetGroupFeed(response) });
        };

        function recursiveGetGroupFeed(response){
          response.data.map(function(post) {
            if(post.message) { $scope.feed.push(post) }
          });
           if (response.paging != "undefined" && response.paging.next != "undefined"){
               Facebook.api(response.paging.next,  function(response) { recursiveGetGroupFeed(response) });
           }
        }
  })

  .controller('authCtrl', function($scope, Facebook) {
    // Defining user logged status
    $scope.logged = false;

	 /**
    * IntentLogin
    */
    $scope.IntentLogin = function() {
      Facebook.getLoginStatus(function(response) {
        if (response.status == 'connected') {
          $scope.logged = true;
          $scope.myGroups();
        }
        else
          $scope.login();
      });
    };

    $scope.login = function() {
      // From now on you can use the Facebook service just as Facebook api says
      Facebook.login(function(response) {
      },{scope: 'user_groups'});
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
  });