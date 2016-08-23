app.factory('auth', ['$http', '$q', '$rootScope', function($http, $q, $rootScope){
  var auth = {};

  auth.register = function(user){
    return $http.post('/register', user);
  };

  auth.login = function(user){
    return $http.post('/login', user).then(function (response) {
      auth.setCurrentUser(response.data.username);
    }, function (error) {
      return $q.reject(error)
    });
  };

  auth.currentUser = null;

  auth.getCurrentUser = function() {
    return $http.get('/currentUser').then(function (response) {
      auth.setCurrentUser(response.data.username);
    });
  }

  auth.setCurrentUser = function (user) {
    auth.currentUser = user;
    $rootScope.$broadcast("currentUserChange", user);
  };

  return auth;
}]);