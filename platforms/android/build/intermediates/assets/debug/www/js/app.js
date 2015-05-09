// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'controllers', 'ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

/// AD MOB PLUGIN INÍCIO
    function onLoad() {
        if(( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
            document.addEventListener('deviceready', initApp, false);
        } else {
            initApp();
        }
    }
  var admobid = {};
  if( /(android)/i.test(navigator.userAgent) ) { 
    admobid = { // for Android
      banner: 'ca-app-pub-6869992474017983/9375997553',
      interstitial: 'ca-app-pub-6869992474017983/1657046752'
    };
  } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
    admobid = { // for iOS
      banner: 'ca-app-pub-6869992474017983/4806197152',
      interstitial: 'ca-app-pub-6869992474017983/7563979554'
    };
  } else {
    admobid = { // for Windows Phone
      banner: 'ca-app-pub-6869992474017983/8878394753',
      interstitial: 'ca-app-pub-6869992474017983/1355127956'
    };
  }
        
    function initApp() {
    if (! AdMob ) { alert( 'admob plugin not ready' ); return; }
    initAd();
        // display the banner at startup
        createSelectedBanner();
    }
    function initAd(){
        var defaultOptions = {
            // bannerId: admobid.banner,
            // interstitialId: admobid.interstitial,
            // adSize: 'SMART_BANNER',
            // width: integer, // valid when set adSize 'CUSTOM'
            // height: integer, // valid when set adSize 'CUSTOM'
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
            bgColor: 'black', // color name, or '#RRGGBB'
            // x: integer,    // valid when set position to 0 / POS_XY
            // y: integer,    // valid when set position to 0 / POS_XY
            isTesting: false, // set to true, to receiving test ad for testing purpose
            // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
        };
        AdMob.setOptions( defaultOptions );
        registerAdEvents();
    }
    // optional, in case respond to events or handle error
    function registerAdEvents() {
        
        // new events, with variable to differentiate: adNetwork, adType, adEvent
        document.addEventListener('onAdFailLoad', function(data){ 
          alert('error: ' + data.error + 
              ', reason: ' + data.reason + 
              ', adNetwork:' + data.adNetwork + 
              ', adType:' + data.adType + 
              ', adEvent:' + data.adEvent); // adType: 'banner' or 'interstitial'
        });
        document.addEventListener('onAdLoaded', function(data){});
        document.addEventListener('onAdPresent', function(data){});
        document.addEventListener('onAdLeaveApp', function(data){});
        document.addEventListener('onAdDismiss', function(data){});
    }
    
    // click button to call following functions
    function getSelectedAdSize() {
        var i = document.getElementById("adSize").selectedIndex;
        var items = document.getElementById("adSize").options;
        return items[i].value;
    }
    function getSelectedPosition() {
        var i = document.getElementById("adPosition").selectedIndex;
        var items = document.getElementById("adPosition").options;
        return parseInt( items[i].value );
    }
    function createSelectedBanner() {
      var overlap = document.getElementById('overlap').checked;
        var offsetTopBar = document.getElementById('offsetTopBar').checked;
        AdMob.createBanner( {adId:admobid.banner, overlap:overlap, offsetTopBar:offsetTopBar, adSize: getSelectedAdSize(), position:getSelectedPosition()} );
    }
    function createBannerOfGivenSize() {
        var w = document.getElementById('w').value;
        var h = document.getElementById('h').value;
        
        AdMob.createBanner( {adId:admobid.banner,
                           adSize:'CUSTOM', width:w, height:h,
                           position:getSelectedPosition()} );
    }
    function showBannerAtSelectedPosition() {
        AdMob.showBanner( getSelectedPosition() );
    }
    function showBannerAtGivenXY() {
        var x = document.getElementById('x').value;
        var y = document.getElementById('y').value;
        AdMob.showBannerAtXY(x, y);
    }
    function prepareInterstitial() {
        var autoshow = document.getElementById('autoshow').checked;
        AdMob.prepareInterstitial({adId:admobid.interstitial, autoShow:autoshow});
    }
    function onResize(){
        var s = document.getElementById('sizeinfo');
        s.innerHTML = "web view: " + window.innerWidth + " x " + window.innerHeight;
    }
/// AD MOB PLUGIN FIM


//// AD MOB CALL
  //if (AdMob) AdMob.showInterstitial();

  //auto show admob
/*  if (AdMob)
    AdMob.createBanner({
        adId:admobid.banner,
        position:AdMob.AD_POSITION.FULL_BANNER,
        autoShow:true
    });*/

//// AD MOB CALL FIM


  });
})
.directive('focusOn', function() {
   return function(scope, elem, attr) {
      scope.$on('focusOn', function(e, name) {
        if(name === attr.focusOn) {
          elem[0].focus();
        }
      });
   };
})
.factory('focus', function ($rootScope, $timeout) {
  return function(name) {
    $timeout(function (){
      $rootScope.$broadcast('focusOn', name);
    });
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