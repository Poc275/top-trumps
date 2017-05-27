angular.module('TCModule').controller('ProfileController', function($scope, Gravatar) {
    $scope.gravatarUrl = Gravatar('poc275@gmail.com', 250);
});