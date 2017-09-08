angular.module('TCModule').controller('StoreController', function($scope) {
    $scope.bronzePackPrice = "500 Boon";
    $scope.bronzePremiumPackPrice = "750 Boon";
    $scope.silverPackPrice = "1500 Boon";
    $scope.silverPremiumPackPrice = "2000 Boon";
    $scope.goldPackPrice = "4500 Boon";
    $scope.goldPremiumPackPrice = "5000 Boon";
    $scope.showPremium = false;

    // user has clicked to buy a pack
    // show them the premium option
    $scope.purchase = function(grade) {
        $scope.purchaseGrade = grade;
        $scope.purchaseGradeIcon = "icons/paper-bag-" + grade + ".svg";
        $scope.purchasePremiumIcon = "icons/paper-bag-" + grade + "-premium.svg";
        
        switch(grade) {
            case 'bronze':
                $scope.purchasePrice = $scope.bronzePackPrice;
                $scope.purchasePremiumPrice = $scope.bronzePremiumPackPrice;
                break;
            case 'silver':
                $scope.purchasePrice = $scope.silverPackPrice;
                $scope.purchasePremiumPrice = $scope.silverPremiumPackPrice;
                break;
            case 'gold':
                $scope.purchasePrice = $scope.goldPackPrice;
                $scope.purchasePremiumPrice = $scope.goldPremiumPackPrice;
                break;
            default:
                break;
        }

        $scope.showPremium = true;
    };
});