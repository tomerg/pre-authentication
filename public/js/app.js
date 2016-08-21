var app = angular.module('beerList', ['ui.router']);

app.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/templates/home.html',
      controller: 'MainCtrl'
    })
    .state('beer', {
      url: '/beers/:id',
      templateUrl: '/templates/beer.html',
      controller: 'BeersCtrl'
    })
jr

  $urlRouterProvider.otherwise('home');
}]);