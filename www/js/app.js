/* global StatusBar */
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', ['ionic', 'controllers', 'ngStorage', 'ngCordova.plugins.googleAds', 'cgNotify'])

  .run(function ($ionicPlatform, $window, $cordovaGoogleAds) {
  $ionicPlatform.ready(function () {
    if ($window.AdMob) {

      $cordovaGoogleAds.prepareInterstitial({
        adId: 'ca-app-pub-1630972949711874/1251380546',
        autoShow: true
      });
    }

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
  .directive('focusOn', function () {
  return function (scope, elem, attr) {
    scope.$on('focusOn', function (e, name) {
      if (name === attr.focusOn) {
        elem[0].focus();
      }
    });
  };
})
  .factory('focus', function ($rootScope, $timeout) {
  return function (name) {
    $timeout(function () {
      $rootScope.$broadcast('focusOn', name);
    });
  };
})
.service('notifyService', function(notify) {
  notify.config({
    duration: 2000,
    startTop: 2,
    maximumOpen: 3
  });

  return {
    alert: notify
  }
});


/*
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('tasks', {
    url: '/tasks',
    controller: 'TasksCtrl',
    templateUrl: 'templates/tasks.html'
  })
  $urlRouterProvider.otherwise('/tasks');
});*/