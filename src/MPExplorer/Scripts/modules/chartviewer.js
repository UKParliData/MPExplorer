define(['Scripts/text!modules/chartviewer.html', 'Scripts/d3jsBindingHandler'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;
            
            self.header = ko.observable(params.header);
            self.source = params.source;
            self.chartId = params.chartId;
            self.isStackedType = params.isStackedType;
            self.seriesNames = params.seriesNames;
            self.questionUrl = params.questionUrl;
            self.listViewerName = params.listViewerName;
            self.chartData = ko.observableArray([]);

            self.convertToChartItems = function (dataset, isAyeNo) {
                var items = [];

                for (var i = 0; i < dataset.length; i++) {
                    isFound = false;
                    for (j = 0; j < items.length; j++)
                        if (items[j].categoryValue === dataset[i].yearMonth) {
                            if (isAyeNo) {
                                if (dataset[i].isAye)
                                    items[j].values[0] += 1;
                                else
                                    items[j].values[1] += 1;
                            }
                            else
                                items[j].values[0] += 1;
                            isFound = true;
                            break;
                        }
                    if (isFound == false)
                        items.push(new MPExplorer.ChartItem(i, isAyeNo ? [dataset[i].isAye ? 1 : 0, dataset[i].isAye ? 0 : 1] : [1], dataset[i].yearMonth, dataset[i].sortDate));
                }

                items.sort(function (left, right) {
                    return left.sortValue === right.sortValue ? left.index - right.index : left.sortValue > right.sortValue ? 1 : -1;
                });
                return items;
            };

            self.refreshChart = ko.computed(function () {
                if ((self.source == null) || ((self.source != null) && (self.source.length == 0)))
                    self.header("No data available");
                else
                    self.chartData(self.convertToChartItems(self.source, self.isStackedType));
            });

            self.barClick = function (data) {
                var arr = [];                
                for (var i = 0; i < self.source.length; i++)
                    if (self.source[i].sortDate == data.sortValue)
                        arr.push(self.source[i]);
                arr.sort(function (left, right) {
                    return left.date === right.date ? left.index - right.index : left.date > right.date ? 1 : -1;
                });
                for (var i = 0; i < arr.length; i++)
                    arr[i].index = i + 1;
                window.subConductorVM.subParameters({
                    date: data.categoryValue,
                    data: arr,
                    questionUrl: self.questionUrl
                });
                window.subConductorVM.selectedSubComponent(self.listViewerName);
            };

            self.dispose = function () {
                self.refreshChart.dispose();
            };
        },
        template: htmlText
    }
});
