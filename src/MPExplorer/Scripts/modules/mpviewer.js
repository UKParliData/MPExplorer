define(['Scripts/text!modules/mpviewer.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.selectedMP = params.selectedMP;
            self.selectMP = function () {
                conductorVM.parameters(null);
                conductorVM.selectedComponent("mp-selector");
            }
        },
        template: htmlText
    }
});
