app.controller('loginCtrl', ['$scope', '$state', 'auth', function($scope, $state, auth){
  $scope.login = function () {
    auth.login($scope.user).then(function(){
      console.log('im going HOME');
      $state.go('home');
    });
  };
}]);