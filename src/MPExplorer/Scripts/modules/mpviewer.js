define(['Scripts/knockout-3.2.0.debug', 'Scripts/text!modules/mpviewer.html'], function (ko, htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.name = params.name;
            self.selectMP = function () {
                window.masterVM.parameters(null);
                window.masterVM.selectedComponent("mp-selector");
            }
        },
        template: htmlText
    }
});
