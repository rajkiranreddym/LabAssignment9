angular.module('starter.controllers', [])
.controller('HomeCtrl', ['$scope', "CameraPopover", "$ionicActionSheet",function($scope, CameraPopover, $ionicActionSheet){
    $scope.showProgress = false;

  var uploadFileUrl = "your serve api";

  $scope.showActionSheet = function(){
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Take Photo' },
        { text: 'Take Phone from albums' }
      ],
      // destructiveText: 'Delete',
      titleText: 'Select photos from',
      cancelText: 'Cancel',
      cancel: function() {
        hideSheet();
      },
      buttonClicked: function(index) {
        // click "take phone"
        if(index == 0){
          takePicture({
            quality : 100,
            allowEdit : true,
            targetWidth: 500,
            targetHeight: 225,
            // Android doesn't recognize this.
            // http://stackoverflow.com/questions/29392639/error-capturing-image-with-phonegap-on-android
            // saveToPhotoAlbum: true,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            destinationType: Camera.DestinationType.FILE_URI
          });
        }else if(index == 1){
          takePicture({
            quality : 100,
            allowEdit : true,
            targetWidth: 500,
            targetHeight: 225,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: Camera.EncodingType.JPEG,
            destinationType: Camera.DestinationType.FILE_URI
          });
        }else{
          return true;
        }
        hideSheet();
      }
    });
  };

  // upload file with a imageURI
  var uploadFile = function(imageURI){
    // show the progress bar
    safeApply( $scope, function(){
      $scope.showProgress = true;
    });
    var uploadOptions = new FileUploadOptions();
    uploadOptions.fileKey = "avatar";
    uploadOptions.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    uploadOptions.mimeType = "image/jpeg";
    uploadOptions.chunkedMode = false;

    var ft = new FileTransfer();

    var statusDom = document.getElementById("ft-prog");

    ft.onprogress = function(progressEvent) {
      if (progressEvent.lengthComputable) {
        var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
        statusDom.value = perc;
        if(perc == 100){
          safeApply($scope, function(){
            $scope.showProgress = false;
          });
        }
      } else {
        console.log("loading....");
      }
    };

    ft.upload(imageURI, encodeURI(uploadFileUrl), onSuccess, onFail, uploadOptions, true);

    function onSuccess(responseData){
      // FIXME: if use responseData.response.avatar_thumb_url will get a undefined
      responseString = JSON.stringify(responseData);
      responseObject = JSON.parse(responseString);
      responsePerson = JSON.parse(responseObject.response);
      safeApply($scope, function(){
        // update your url
        // $scope.person.avatar_square_url = responsePerson.avatar_square_url;
      });
    };
    function onFail(){
      alert("something wrong, please try again");
    };
  };

  //get photos form device and return a file path url
  var takePicture = function(options) {
    CameraPopover.getPicture(options).then(function(imageURI){
      uploadFile(imageURI);
    }, function(err){
      console.error(err);
    });
  };

}])
.controller('AppCtrl', function($scope, $ionicModal, $http, $timeout, $state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.logout = function() {
    $state.go('login');
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})
    .controller('HomeCtrl', function($scope, $stateParams) {
    $scope.welcome = "Welcome to Student Companion";
    })

  .controller('LoginCtrl', function($scope, $state, $http, $window, $httpParamSerializerJQLike, $timeout) {

    $scope.loginData = {};

    $scope.doLogin = function(sso, password) {
      console.log('Doing login', $scope.loginData);

      // $scope.data = {};
      var count=0;
      var remcount=3;
      var flag=1;
      $scope.pageClass = 'home';
      $scope.home = function() {
        console.log("home page !");
        $state.go('home');
      }
      $scope.pageClass = 'login';
     // $scope.login = function(username, password) {
        //console.log("inside login function");
        //inside.getMethod();
        $http({
          method: 'GET',
          url: 'https://api.mongolab.com/api/1/databases/studentcompaniondb/collections/Login?apiKey=PPjxva2p9SH3NomyxSQ6rdwiofOu1q2L',
          contentType: "application/json"
        }).success(function (response) {
          var list = response;

          for (var i = 0; i < list.length; i++) {
            if (angular.equals(list[i].SSO, sso) && angular.equals(list[i].Password, password)) {

              localStorage.setItem("username", list[i].SSO);
              localStorage.setItem("password", list[i].Password);
              console.log("inside if loop");
              flag = 0;
              $state.go('app.home');

            } else {
              //alert("Incorrect username/password");
              console.log("inside else loop");
              count++;
            }
          }

          if (count == list.length) {
            // alert("hiii");
            /*  remcount--;
             alert("Attempts remaining  "+remcount);
             if(remcount==0){
             alert("Please try again");
             $window.close();

             ionic.Platform.exitApp();
             }*/
            $state.go('login');
            document.getElementById('x').innerHTML = "<p><h3>Invalid Credentials! Please try again....</h3></p>";
          }
        })

    //  }
      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      //$timeout(function() {
      //  $state.go('app.search');
      //}, 1000);
    };

    })
.controller('PlaylistCtrl', function($scope, $stateParams) {
});
app.controller('MapController', function($scope, $cordovaGeolocation, $ionicLoading) {

    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {

        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Locating you!!!'
        });

        var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            var lat  = position.coords.latitude;
            var long = position.coords.longitude;
             console.log(lat);
            console.log(long);
            var myLatlng = new google.maps.LatLng(lat, long);

            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"), mapOptions);
            var marker = new google.maps.Marker({
                position: myLatlng,
                title: 'My Location!!!'
            });
            marker.setMap(map);
            $scope.map = map;
            $ionicLoading.hide();

        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
        });
    }
});
