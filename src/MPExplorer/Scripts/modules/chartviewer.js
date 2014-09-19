define(['Scripts/text!modules/chartviewer.html', 'Scripts/d3jsBindingHandler'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;
            
            self.header = params.header;
            self.data = params.data;
            self.clickCallback = params.clickCallback;
            self.chartId = ko.observable(params.chartId);
            self.isStackedType = ko.observable(params.isStackedType);
            self.seriesNames = params.seriesNames;

            self.refreshChart = ko.computed(function () {
                if ((self.data() == null) || ((self.data() != null) && (self.data().length == 0)))
                    self.header("No data available");
            });

            self.dispose = function () {
                self.refreshChart.dispose();
            };
        },
        template: htmlText
    }
});
