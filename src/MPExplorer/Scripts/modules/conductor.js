define([], function () {
    var conductorVM = function () {
        var self = this;

        self.selectedComponent = ko.observable("mp-selector");
        self.parameters = ko.observable(null);
        self.messages = ko.observable([]);

        self.removeMessage = function () {
            self.messages.remove(this);
        };

        self.goHome = function () {
            self.selectedComponent("mp-selector");
        };
    }
    return conductorVM;
});