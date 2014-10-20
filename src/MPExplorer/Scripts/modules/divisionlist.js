define(['Scripts/text!modules/divisionlist.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.date = params.date;
            self.divisions = params.data;

            self.showDivision = function () {
                window.subConductorVM.subParameters({ selectedItem: this });
                window.subConductorVM.selectedSubComponent("division-viewer");
            };

        },
        template: htmlText
    }
});
