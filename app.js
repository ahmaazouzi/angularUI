// app module
var app5 = angular.module('app5', ['ngAnimate','ui.bootstrap', 'ui.grid',
 'storageService']);



app5.controller('userCtrl',function ($scope, $uibModal, getLocalStorage) {

  // angularUI datepicker options
  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.date = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date(tomorrow);
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }

  	// create/save user data
	$scope.users = getLocalStorage.getUsers();
	$scope.addUser = function(userInfo) {
        $scope.users.push({flName: userInfo.flName,
        					jobTitle: userInfo.jobTitle,
        					date: userInfo.dt.toDateString(),
        					gender: userInfo.gender
       						 });
        getLocalStorage.updateUsers($scope.users);
        $scope.newUser = '';
        };

   // modal 
  $scope.animationsEnabled = true;

  $scope.open = function (size) {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
    });
  };
});


// Modal instance controller
app5.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {
  $scope.ok = function () {
    $uibModalInstance.close(); 
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});


// local storage service
var storageService = angular.module('storageService', []);
storageService.factory('getLocalStorage', function() {
var userList = {};
return {
    list: userList,
    updateUsers: function (userArr) {
        if (window.localStorage && userArr) {
            localStorage.setItem("user", angular.toJson(userArr));
        }
        userList = userArr;
    },
    getUsers: function () {
       userList = angular.fromJson( localStorage.getItem("user") );
       return userList ? userList : [];
    }
};
});







