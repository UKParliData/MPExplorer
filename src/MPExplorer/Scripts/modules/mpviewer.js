define(['Scripts/text!modules/mpviewer.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.selectedMP = params.selectedMP;
            self.selectMP = function () {
                window.masterVM.parameters(null);
                window.masterVM.selectedComponent("mp-selector");
            }
        },
        template: htmlText
    }
});
