define(['Scripts/knockout-3.2.0.debug', 'Scripts/text!modules/mpselector.html'], function (ko, htmlText) {
    return {
        viewModel: function () {
            var self = this;

            var mps = [];
            mps.push({
                id: null,
                name: ""
            });
            mps.push({
                id: 0,
                name: "abc 1"
            });
            mps.push({
                id: 1,
                name: "def 2"
            });
            mps.push({
                id: 3,
                name: "ghi 1"
            });
            self.names = ko.observableArray(mps);
            self.selectedMPId = ko.observable(null);

            self.selectedMP=ko.pureComputed(function () {
                return ko.utils.arrayFirst(self.names(), function (item) {
                    return item.id == self.selectedMPId();
                });
            });

            self.showMP = function () {
                window.masterVM.parameters(self.selectedMP());
                window.masterVM.selectedComponent("mp-voter");
            }
        },
        template: htmlText
    }
});
