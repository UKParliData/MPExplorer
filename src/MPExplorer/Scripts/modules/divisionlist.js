define(['Scripts/text!modules/divisionlist.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.date = params.date;
            self.divisions = params.divisions;
            self.selectedDivision=ko.observable(null);

            self.showDivision = function () {
                self.selectedDivision(this);
            };

        },
        template: htmlText
    }
});
