var question = function (urlId, dateTabled, dateAnswered, questionText, tablingMember, memberUrlId) {
    var splitUrl = urlId.split("/");
    var idIndex = splitUrl.length - 1;
    if (splitUrl[idIndex] === "")
        idIndex = splitUrl.length - 2;
    this.url = urlId;
    this.id = urlId.split("/")[idIndex];
    this.dateTabled = dateTabled;
    this.dateAnswered = dateAnswered;
    this.questionText = questionText;
    this.tablingMember = tablingMember;
    splitUrl = memberUrlId.split("/");
    idIndex = splitUrl.length - 1;
    if (splitUrl[idIndex] === "")
        idIndex = splitUrl.length - 2;
    this.memberId = urlId.split("/")[idIndex];
    this.yearMonth = dateTabled.split("-")[0] + " " + MPExplorer.months[dateTabled.split("-")[1] - 1];
    this.sortDate = dateTabled.split("-")[0] + dateTabled.split("-")[1];
};

define(['Scripts/text!modules/questionviewer.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.selectedQuestion = params.selectedItem;
            self.questionUrl=params.questionUrl;
            self.answeringBody = ko.observable();
            self.answerDate = ko.observable();
            self.title = ko.observable();
            self.isLoading = ko.observable(true);
            self.headerByAnsweringBodyAndMonth = ko.observable(null);

            self.retriveQuestion = function (data) {
                if ((data != null) && (data.result != null) && (data.result.primaryTopic != null)) {
                    self.answerDate(data.result.primaryTopic.AnswerDate._value);
                    self.answeringBody(data.result.primaryTopic.answeringDepartment);
                    self.title(data.result.primaryTopic.fullTitle);
                }
                self.isLoading(false);
            };

            self.showInfo = ko.computed(function () {
                self.isLoading(true);
                MPExplorer.getData(self.questionUrl + "/" + self.selectedQuestion.id + ".json",
                    {
                        _properties: "AnswerDate,answeringDepartment,questionText",
                        _view: "basic"
                    },
                    self.retriveQuestion);
            });

            self.convertToChartItems = function (dataset) {
                var items = [];

                for (var i = 0; i < dataset.length; i++) {
                    isFound = false;
                    for (j = 0; j < items.length; j++)
                        if (items[j].categoryValue === dataset[i].yearMonth) {
                            if (dataset[i].isTabled)
                                items[j].values[0] += 1;
                            else
                                items[j].values[1] += 1;
                            isFound = true;
                            break;
                        }
                    if (isFound == false)
                        items.push(new MPExplorer.ChartItem(i, [dataset[i].isTabled ? 1 : 0, dataset[i].isTabled ? 0 : 1], dataset[i].yearMonth, dataset[i].sortDate));
                }

                items.sort(function (left, right) {
                    return left.sortValue === right.sortValue ? left.index - right.index : left.sortValue > right.sortValue ? 1 : -1;
                });
                return items;
            };

            self.retriveQuestionsForAnsweringBody = function (data) {
                var questions = [];

                if ((data != null) && (data.result != null) && (data.result.items != null) && (data.result.items.length > 0))
                    for (var i = 0; i < data.result.items.length; i++)
                        if ((data.result.items[i].dateTabled != null) && (data.result.items[i].dateTabled._value != null) &&
                            (data.result.items[i].AnswerDate != null) && (data.result.items[i].AnswerDate._value != null))
                            questions.push(new question(data.result.items[i]._about, data.result.items[i].dateTabled._value,
                                data.result.items[i].AnswerDate._value, data.result.items[i].questionText, data.result.items[i].tablingMemberPrinted, data.result.items[i].tablingMember));
                questions.sort(function (left, right) {
                    return left.dateTabled === right.dateTabled ? left.index - right.index : left.dateTabled > right.dateTabled ? 1 : -1;
                });
                window.subConductorVM.subParameters({
                    chartId: 'chartQ',
                    header: 'Questions by month to ' + self.answeringBody(),
                    source: questions,
                    isStackedType: true,
                    seriesNames: ['Tabled', 'Answered'],
                    listViewerName: "full-question-list"
                });                
                window.subConductorVM.selectedSubComponent("chart-viewer");
                //self.headerByAnsweringBodyAndMonth("Questions in " + data.categoryValue + " to " + self.answeringBody());                
            };

            self.showAnsweringBodyQuestions = function () {               
                MPExplorer.getData(self.questionUrl + ".json",
                    {
                        _properties: "dateTabled,AnswerDate,questionText,tablingMemberPrinted,tablingMember",
                        _view: "basic",
                        _page: 0,
                        _pageSize: 50000,
                        answeringDepartment: this.answeringBody()
                    },
                    self.retriveQuestionsForAnsweringBody);
            };

            self.dispose = function () {
                self.showInfo.dispose();
            };
        },
        template: htmlText
    }
});