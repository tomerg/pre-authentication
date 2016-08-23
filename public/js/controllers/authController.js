app.controller('AuthCtrl', ['$scope', '$state', 'auth', function($scope, $state, auth){
  
  $scope.register = function () {
    auth.register($scope.user).then(function(){
      console.log('im going HOME');
      $state.go('home');
    });
  };

  $scope.login = function(){
    auth.login($scope.user).then(function (){
      $state.go('home');
    }, function(error){
      $scope.error = error.data;
    });
  };

}]);