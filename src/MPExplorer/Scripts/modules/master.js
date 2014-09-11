define([], function () {
    var masterVM = function () {
        var self = this;

        self.selectedComponent = ko.observable("mp-selector");
        self.parameters = ko.observable(null);

        self.goHome = function () {
            self.selectedComponent("mp-selector");
        };
    }
    return masterVM;
});