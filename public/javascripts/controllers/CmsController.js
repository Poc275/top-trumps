angular.module('TCModule').controller('CmsController', function($scope, $http, Cards) {
    $scope.card = {
        name: '',
        unpalatibility: 0,
        arsemanship: 0,
        media: 0,
        legacy: 0,
        ppc: 0,
        specialAbility: 0,
        category: '',
        specialAbilityDesc: '',
        bio: '',
        references: []
    };

    $scope.querySearch = querySearch;
    $scope.selectedItemChange = selectedItemChange;

    Cards.all().then(function(cards) {
        $scope.cards = cards.data;
        // just want names for autocomplete
        $scope.names = $scope.cards.map(function(card) {
            return {
                value: card.name,
                image: card.images[0]
            };
        });
    }, function(err) {
        console.log(err);
        $scope.cards = null;
    });

    $scope.calcAverage = function() {
        $scope.average = ($scope.card.unpalatibility + 
                         $scope.card.arsemanship + 
                         $scope.card.media + 
                         $scope.card.legacy + 
                         $scope.card.specialAbility) / 5;
    };
    
    function querySearch(query) {
        var results = query ? $scope.names.filter(createFilterFor(query)) : $scope.names;
        return results;
    }

    function selectedItemChange(item) {
        console.log("Selected item changed: ", item);
    }

    function createFilterFor(query) {
        return function filterFn(card) {
            return (card.value.indexOf(query) === 0);
        };
    }
});