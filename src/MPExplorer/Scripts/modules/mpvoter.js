var division = function (urlId, divisiondate, isAye) {
    var splitUrl = urlId.split("/");
    var idIndex = splitUrl.length - 1;
    if (splitUrl[idIndex] === "")
        idIndex = splitUrl.length - 2;
    this.url = urlId;
    this.id = urlId.split("/")[idIndex];
    this.isAye = isAye;
    this.date = divisiondate;
    this.yearMonth = divisiondate.split("-")[0] + " " + MPExplorer.months[divisiondate.split("-")[1] - 1];
    this.sortDate = divisiondate.split("-")[0] + divisiondate.split("-")[1];
}

var oralQuestion = function (urlId, dateTabled) {
    var splitUrl = urlId.split("/");
    var idIndex = splitUrl.length - 1;
    if (splitUrl[idIndex] === "")
        idIndex = splitUrl.length - 2;
    this.url = urlId;
    this.id = urlId.split("/")[idIndex];
    this.date = dateTabled;
    this.yearMonth = dateTabled.split("-")[0] + " " + MPExplorer.months[dateTabled.split("-")[1] - 1];
    this.sortDate = dateTabled.split("-")[0] + dateTabled.split("-")[1];
}

var writtenQuestion = function (urlId, dateTabled) {
    var splitUrl = urlId.split("/");
    var idIndex = splitUrl.length - 1;
    if (splitUrl[idIndex] === "")
        idIndex = splitUrl.length - 2;
    this.url = urlId;
    this.id = urlId.split("/")[idIndex];
    this.date = dateTabled;
    this.yearMonth = dateTabled.split("-")[0] + " " + MPExplorer.months[dateTabled.split("-")[1] - 1];
    this.sortDate = dateTabled.split("-")[0] + dateTabled.split("-")[1];
}

define(['Scripts/d3.min', 'Scripts/text!modules/mpvoter.html'], function (d3, htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.selectedMP = params.selectedMP;
            self.selectedVoting = ko.observable(params.selectedVoting);
            self.chartHeader=ko.observable(null);
            self.dataset = ko.observableArray([]);
            self.selectedYearMonth = ko.observable(null);
            self.selectedChart = ko.observable(null);
            self.isVotesLoading = ko.observable(true);
            self.isOralQuestionsLoading = ko.observable(true);
            self.isWrittenQuestionsLoading = ko.observable(true);
            self.selectedBarData = ko.observableArray([]);
            self.isStackedType = ko.observable(null);
            self.seriesNames = ko.observableArray([]);
            self.questionUrl = ko.observable();

            self.barClick = function (data) {
                var arr = [];
                var source = [];
                switch (self.selectedChart()) {
                    case 1:
                        source = self.divisions;
                        break;
                    case 2:
                        source = self.oralQuestions;
                        self.questionUrl("commonsoralquestions");
                        break;
                    case 3:
                        source = self.writtenQuestions;
                        self.questionUrl("commonswrittenquestions");
                        break;
                }
                for (var i = 0; i < source.length; i++)
                    if (source[i].sortDate == data.sortValue)
                        arr.push(source[i]);
                arr.sort(function (left, right) {
                    return left.date === right.date ? left.index - right.index : left.date > right.date ? 1 : -1;
                });
                for (var i = 0; i < arr.length; i++)
                    arr[i].index = i + 1;
                self.selectedYearMonth(data.categoryValue);
                self.selectedBarData(arr);
            };

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

            self.chartSelection = function (selectedChart) {
                var items = [];
                self.selectedBarData([]);
                self.selectedChart(selectedChart);                
                if ((selectedChart == 1) && (self.divisions.length > 0)) {
                    self.chartHeader("Number of votes per calendar month");
                    self.isStackedType(true);
                    self.seriesNames(["Aye","No"]);
                    items = self.convertToChartItems(self.divisions, self.isStackedType());
                }
                if ((selectedChart == 2) && (self.oralQuestions.length > 0)) {
                    self.chartHeader("Number of oral questions per calendar month");
                    self.isStackedType(false);
                    self.seriesNames(["Oral question"]);
                    items = self.convertToChartItems(self.oralQuestions, self.isStackedType());
                }
                if ((selectedChart == 3) && (self.writtenQuestions.length > 0)) {
                    self.chartHeader("Number of written questions per calendar month");
                    self.isStackedType(false);
                    self.seriesNames(["Written question"]);
                    items = self.convertToChartItems(self.writtenQuestions, self.isStackedType());
                }
                self.dataset(items);
            };

            self.numberOfVotes = ko.observable();
            self.numberOfOralQuestions = ko.observable();
            self.numberOfWrittenQuestions = ko.observable();
            self.divisions = [];
            self.oralQuestions = [];
            self.writtenQuestions = [];

            self.retriveVotes = function (ayes) {
                MPExplorer.getData("commonsdivisions/no.json?_properties=divisiondate&_view=basic&_page=0&_pageSize=50000&mnisId=" + params.selectedMP.id, function (noes) {
                    var divisions = [];
                    var populateDivisions = function (data, isAye) {
                        if ((data != null) && (data.result != null) && (data.result.items != null) && (data.result.items.length > 0))
                            for (var i = 0; i < data.result.items.length; i++)
                                if ((data.result.items[i].divisiondate != null) && (data.result.items[i].divisiondate.length > 0))
                                    for (var j = 0; j < data.result.items[i].divisiondate.length; j++)
                                        divisions.push(new division(data.result.items[i]._about, data.result.items[i].divisiondate[j]._value, isAye));
                    }
                    populateDivisions(ayes, true);
                    populateDivisions(noes, false);
                    self.numberOfVotes(divisions.length);
                    self.divisions = divisions;
                    self.isVotesLoading(false);
                });
            };

            self.retriveOralQuestions=function (data) {
                var questions = [];
                if ((data != null) && (data.result != null) && (data.result.items != null) && (data.result.items.length > 0))
                    for (var i = 0; i < data.result.items.length; i++)
                        if ((data.result.items[i].dateTabled != null) && (data.result.items[i].dateTabled._value != null))
                            questions.push(new oralQuestion(data.result.items[i]._about, data.result.items[i].dateTabled._value));
                self.numberOfOralQuestions(questions.length);
                self.oralQuestions = questions;
                self.isOralQuestionsLoading(false);
            };

            self.retriveWrittenQuestions=function (data) {
                var questions = [];
                if ((data != null) && (data.result != null) && (data.result.items != null) && (data.result.items.length > 0))
                    for (var i = 0; i < data.result.items.length; i++)
                        if ((data.result.items[i].dateTabled != null) && (data.result.items[i].dateTabled._value != null))
                            questions.push(new writtenQuestion(data.result.items[i]._about, data.result.items[i].dateTabled._value));
                self.numberOfWrittenQuestions(questions.length);
                self.writtenQuestions = questions;
                self.isWrittenQuestionsLoading(false);
            };

            MPExplorer.getData("commonsdivisions/aye.json?_properties=divisiondate&_view=basic&_page=0&_pageSize=50000&mnisId=" + params.selectedMP.id, self.retriveVotes);
            
            MPExplorer.getData("commonsoralquestions.json?_properties=dateTabled&_view=basic&_page=0&_pageSize=50000&mnisId=" + params.selectedMP.id, self.retriveOralQuestions);

            MPExplorer.getData("commonswrittenquestions.json?_properties=dateTabled&_view=basic&_page=0&_pageSize=50000&mnisId=" + params.selectedMP.id, self.retriveWrittenQuestions);

        },
        template: htmlText
    }
});
