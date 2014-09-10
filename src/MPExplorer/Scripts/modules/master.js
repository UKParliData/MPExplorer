define(['Scripts/knockout-3.2.0.debug'], function (ko) {
    var masterVM = function () {
        var self = this;

        self.selectedComponent = ko.observable("mp-selector");
        self.parameters = ko.observable(null);
    }
    return masterVM;
});