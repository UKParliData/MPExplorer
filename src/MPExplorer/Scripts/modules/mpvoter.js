var division = function (urlId, divisiondate, title, isAye) {
    var splitUrl = urlId.split("/");
    var idIndex = splitUrl.length - 1;
    if (splitUrl[idIndex] === "")
        idIndex = splitUrl.length - 2;
    this.url = urlId;
    this.id = urlId.split("/")[idIndex];
    this.isAye = isAye;
    this.date = divisiondate;
    this.title = title;
    this.yearMonth = divisiondate.split("-")[0] + " " + MPExplorer.months[divisiondate.split("-")[1] - 1];
    this.sortDate = divisiondate.split("-")[0] + divisiondate.split("-")[1];
}

var oralQuestion = function (urlId, dateTabled, questionText) {
    var splitUrl = urlId.split("/");
    var idIndex = splitUrl.length - 1;
    if (splitUrl[idIndex] === "")
        idIndex = splitUrl.length - 2;
    this.url = urlId;
    this.id = urlId.split("/")[idIndex];
    this.date = dateTabled;
    this.questionText = questionText;
    this.yearMonth = dateTabled.split("-")[0] + " " + MPExplorer.months[dateTabled.split("-")[1] - 1];
    this.sortDate = dateTabled.split("-")[0] + dateTabled.split("-")[1];
}

var writtenQuestion = function (urlId, dateTabled, questionText) {
    var splitUrl = urlId.split("/");
    var idIndex = splitUrl.length - 1;
    if (splitUrl[idIndex] === "")
        idIndex = splitUrl.length - 2;
    this.url = urlId;
    this.id = urlId.split("/")[idIndex];
    this.date = dateTabled;
    this.questionText = questionText;
    this.yearMonth = dateTabled.split("-")[0] + " " + MPExplorer.months[dateTabled.split("-")[1] - 1];
    this.sortDate = dateTabled.split("-")[0] + dateTabled.split("-")[1];
}

var earlyDatMotion = function (urlId, dateTabled, motionText, numberOfSignatures) {
    var splitUrl = urlId.split("/");
    var idIndex = splitUrl.length - 1;
    if (splitUrl[idIndex] === "")
        idIndex = splitUrl.length - 2;
    this.url = urlId;
    this.id = urlId.split("/")[idIndex];
    this.date = dateTabled;
    this.motionText = motionText;
    this.numberOfSignatures = numberOfSignatures;
    this.yearMonth = dateTabled.split("-")[0] + " " + MPExplorer.months[dateTabled.split("-")[1] - 1];
    this.sortDate = dateTabled.split("-")[0] + dateTabled.split("-")[1];
}

define(['Scripts/d3.min', 'Scripts/text!modules/mpvoter.html', 'Scripts/selectize', 'Scripts/selectizeBindingHandler'], function (d3, htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.selectedMP = params.selectedMP;
            self.isVotesLoading = ko.observable(true);
            self.isOralQuestionsLoading = ko.observable(true);
            self.isWrittenQuestionsLoading = ko.observable(true);
            self.isEarlyDayMotionsLoading = ko.observable(true);
            self.numberOfVotes = ko.observable();
            self.numberOfOralQuestions = ko.observable();
            self.numberOfWrittenQuestions = ko.observable();
            self.numberOfEarlyDayMotions = ko.observable();
            self.selectedChart = ko.observable(null);
            self.divisions = [];
            self.oralQuestions = [];
            self.writtenQuestions = [];
            self.earlyDayMotions = [];
            self.selectedSearchId = ko.observable(null);
            self.selectedSubComponent = ko.observable(null);
            self.subParameters = ko.observable(null);

            self.showItemFromSearch = ko.computed(function () {
                var selectedItem = null;
                var arr = [];
                var viewerName = "";
                var questionUrl = "";

                if (self.selectedSearchId() != null) {
                    switch (self.selectedChart()) {
                        case 1:
                            arr = self.divisions;
                            viewerName = "division-viewer";
                            break;
                        case 2:
                            arr = self.oralQuestions;
                            viewerName = "question-viewer";
                            questionUrl = "commonsoralquestions";
                            break;
                        case 3:
                            arr = self.writtenQuestions;
                            viewerName = "question-viewer";
                            questionUrl = "commonswrittenquestions";
                            break;
                    }
                    for (var i = 0; i < arr.length; i++)
                        if (arr[i].id == self.selectedSearchId()) {
                            selectedItem = arr[i];
                            break;
                        }
                    self.subParameters({
                        selectedItem: selectedItem,
                        questionUrl: questionUrl
                    });
                    self.selectedSubComponent(viewerName);
                }
            });

            self.chartSelection = function (selectedChart) {
                var questionUrl = "";
                var listViewerName = "";
                var chartHeader = "";
                var isStackedType = false;
                var seriesNames = [];
                var source = [];

                self.selectedChart(selectedChart);
                if ((selectedChart == 1) && (self.divisions.length > 0)) {
                    chartHeader = "Number of votes per calendar month";
                    isStackedType = true;
                    seriesNames = ["Aye", "No"];
                    source = self.divisions;
                    listViewerName = "division-list";
                }
                if ((selectedChart == 2) && (self.oralQuestions.length > 0)) {
                    chartHeader = "Number of oral questions per calendar month";
                    isStackedType = "false";
                    seriesNames = ["Oral question"];
                    source = self.oralQuestions;
                    questionUrl = "commonsoralquestions";
                    listViewerName = "question-list";
                }
                if ((selectedChart == 3) && (self.writtenQuestions.length > 0)) {
                    chartHeader = "Number of written questions per calendar month";
                    isStackedType = false;
                    seriesNames = ["Written question"];
                    source = self.writtenQuestions;
                    questionUrl = "commonswrittenquestions";
                    listViewerName = "question-list";
                }
                if ((selectedChart == 4) && (self.earlyDayMotions.length > 0)) {
                    chartHeader = "Number of early day motions per calendar month";
                    isStackedType = false;
                    seriesNames = ["Early day motion"];
                    source = self.earlyDayMotions;                    
                    listViewerName = "edm-list";
                }
                self.subParameters({
                    chartId: "chartVote",
                    header: chartHeader,
                    source: source,
                    questionUrl: questionUrl,
                    isStackedType: isStackedType,
                    seriesNames: seriesNames,
                    listViewerName: listViewerName
                });
                self.selectedSubComponent("chart-viewer");
            };

            self.retriveVotes = function (ayes) {
                MPExplorer.getData("commonsdivisions/no.json?_properties=date,title&_view=basic&_page=0&_pageSize=50000&mnisId=" + params.selectedMP.id, function (noes) {
                    var divisions = [];

                    var populateDivisions = function (data, isAye) {
                        if ((data != null) && (data.result != null) && (data.result.items != null) && (data.result.items.length > 0))
                            for (var i = 0; i < data.result.items.length; i++)
                                if (data.result.items[i].date != null)
                                    divisions.push(new division(data.result.items[i]._about, data.result.items[i].date._value, data.result.items[i].title, isAye));
                    }
                    populateDivisions(ayes, true);
                    populateDivisions(noes, false);
                    self.numberOfVotes(divisions.length);
                    self.divisions = divisions;
                    self.isVotesLoading(false);
                });
            };

            self.retriveOralQuestions = function (data) {
                var questions = [];
                if ((data != null) && (data.result != null) && (data.result.items != null) && (data.result.items.length > 0))
                    for (var i = 0; i < data.result.items.length; i++)
                        if ((data.result.items[i].dateTabled != null) && (data.result.items[i].dateTabled._value != null))
                            questions.push(new oralQuestion(data.result.items[i]._about, data.result.items[i].dateTabled._value, data.result.items[i].questionText));
                self.numberOfOralQuestions(questions.length);
                self.oralQuestions = questions;
                self.isOralQuestionsLoading(false);
            };

            self.retriveWrittenQuestions = function (data) {
                var questions = [];
                if ((data != null) && (data.result != null) && (data.result.items != null) && (data.result.items.length > 0))
                    for (var i = 0; i < data.result.items.length; i++)
                        if ((data.result.items[i].dateTabled != null) && (data.result.items[i].dateTabled._value != null))
                            questions.push(new writtenQuestion(data.result.items[i]._about, data.result.items[i].dateTabled._value, data.result.items[i].questionText));
                self.numberOfWrittenQuestions(questions.length);
                self.writtenQuestions = questions;
                self.isWrittenQuestionsLoading(false);
            };

            self.retriveEDMs = function (data) {
                var edms = [];
                if ((data != null) && (data.result != null) && (data.result.items != null) && (data.result.items.length > 0))
                    for (var i = 0; i < data.result.items.length; i++)
                        if ((data.result.items[i].dateTabled != null) && (data.result.items[i].dateTabled._value != null))
                            edms.push(new earlyDatMotion(data.result.items[i]._about, data.result.items[i].dateTabled._value, data.result.items[i].motionText, data.result.items[i].numberOfSignatures));
                self.numberOfEarlyDayMotions(edms.length);
                self.earlyDayMotions = edms;
                self.isEarlyDayMotionsLoading(false);
            };

            self.dispose = function () {
                self.showItemFromSearch.dispose();
            };

            MPExplorer.getData("commonsdivisions/aye.json?_properties=date,title&_view=basic&_page=0&_pageSize=50000&mnisId=" + params.selectedMP.id, self.retriveVotes);

            MPExplorer.getData("commonsoralquestions.json?_properties=dateTabled,questionText&_view=basic&_page=0&_pageSize=50000&mnisId=" + params.selectedMP.id, self.retriveOralQuestions);

            MPExplorer.getData("commonswrittenquestions.json?_properties=dateTabled,questionText&_view=basic&_page=0&_pageSize=50000&mnisId=" + params.selectedMP.id, self.retriveWrittenQuestions);

            MPExplorer.getData("edms.json?_properties=dateTabled,numberOfSignatures,motionText&_view=basic&_page=0&_pageSize=50000&mnisId=" + params.selectedMP.id, self.retriveEDMs);

            window.subConductorVM = self;
        },
        template: htmlText
    }
});
