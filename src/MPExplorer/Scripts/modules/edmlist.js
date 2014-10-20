define(['Scripts/text!modules/edmlist.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.date = params.date;
            self.edms = params.data;
            
            self.showSignatures = function () {
                window.subConductorVM.subParameters({
                    selectedItem: this
                });
                window.subConductorVM.selectedSubComponent("edm-signature-list");
            };
        },
        template: htmlText
    }
});
