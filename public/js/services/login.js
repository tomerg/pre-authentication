app.factory('auth', ['$http', function($http){
  var authObj = {};

  authObj.login = function(user){
    return $http.post('/login', user);
  };

  return authObj;
}]);