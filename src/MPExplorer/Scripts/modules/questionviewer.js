var questionAnswerBody = function (urlId, date, isTabled) {
    var splitUrl = urlId.split("/");
    var idIndex = splitUrl.length - 1;
    if (splitUrl[idIndex] === "")
        idIndex = splitUrl.length - 2;
    this.url = urlId;
    this.id = urlId.split("/")[idIndex];
    this.isTabled = isTabled;
    this.date = date;
    this.yearMonth = date.split("-")[0] + " " + MPExplorer.months[date.split("-")[1] - 1];
    this.sortDate = date.split("-")[0] + date.split("-")[1];
}

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
    this.memberId= urlId.split("/")[idIndex];
}

define(['Scripts/text!modules/questionviewer.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.selectedQuestion = params.selectedQuestion;
            self.questionUrl=params.questionUrl;
            self.answeringBody = ko.observable();
            self.answerDate = ko.observable();
            self.questionText = ko.observable();
            self.title = ko.observable();
            self.isLoading = ko.observable(true);
            self.isAnsweringBodyQuestionsChart = ko.observable(false);
            self.questions = ko.observableArray([]);
            self.questionsByAnsweringBodyAndMonth = ko.observableArray([]);
            self.headerByAnsweringBodyAndMonth = ko.observable(null);
            self.isQuestionsByAnsweringBodyAndMonth = ko.observable(false);
            self.isLoadingQuestionsByAnsweringBodyAndMonth = ko.observable(false);

            self.retriveQuestion = function (data) {
                if ((data != null) && (data.result != null) && (data.result.primaryTopic != null)) {
                    self.answerDate(data.result.primaryTopic.AnswerDate._value);
                    self.answeringBody(data.result.primaryTopic.answeringDepartment);
                    self.questionText(data.result.primaryTopic.questionText);
                    self.title(data.result.primaryTopic.fullTitle);
                }
                self.isLoading(false);
            };

            self.showInfo = ko.computed(function () {
                self.isLoading(true);
                self.isAnsweringBodyQuestionsChart(false);
                self.isQuestionsByAnsweringBodyAndMonth(false);                
                MPExplorer.getData(self.questionUrl() + "/" + self.selectedQuestion().id + ".json?_properties=AnswerDate,answeringDepartment,questionText&_view=basic", self.retriveQuestion);
            });

            self.retriveQuestionsByAnsweringBodyAndMonth = function (data) {
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
                self.questionsByAnsweringBodyAndMonth(questions);
                self.isLoadingQuestionsByAnsweringBodyAndMonth(false);
                self.isQuestionsByAnsweringBodyAndMonth(true);
            };

            self.barClick = function (data) {
                var minDate = data.sortValue.substring(0, 4) + "-" + data.sortValue.substring(4, 6) + "-01";
                var tempDate = new Date(new Date(data.sortValue.substring(0, 4), data.sortValue.substring(5, 2), 1) - 1);
                var maxDate = data.sortValue.substring(0, 4) + "-" + data.sortValue.substring(4, 6) + "-" + tempDate.getDate();
                self.headerByAnsweringBodyAndMonth("Questions in " + data.categoryValue);
                self.isLoadingQuestionsByAnsweringBodyAndMonth(true);
                MPExplorer.getData(self.questionUrl() + ".json?_properties=dateTabled,AnswerDate,questionText,tablingMemberPrinted,tablingMember&_view=basic&_page=0&_pageSize=50000&answeringDepartment=" + self.answeringBody() + "&min-dateTabled=" + minDate + "&max-dateTabled=" + maxDate, self.retriveQuestionsByAnsweringBodyAndMonth);
                //MPExplorer.getData(self.questionUrl() + ".json?_properties=dateTabled,AnswerDate,questionText,tablingMemberPrinted,tablingMember&_view=basic&_page=0&_pageSize=50000&answeringDepartment=" + self.answeringBody() + "&min-AnswerDate=" + minDate + "&max-AnswerDate=" + maxDate, self.retriveQuestionsByAnsweringBodyAndMonth);
            };

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
                        if ((data.result.items[i].dateTabled != null) && (data.result.items[i].AnswerDate != null)) {
                            questions.push(new questionAnswerBody(data.result.items[i]._about, data.result.items[i].dateTabled._value, true));
                            questions.push(new questionAnswerBody(data.result.items[i]._about, data.result.items[i].AnswerDate._value, false));
                        }
                self.questions(self.convertToChartItems(questions));
                self.isAnsweringBodyQuestionsChart(true);
            };

            self.showAnsweringBodyQuestions = function () {
                MPExplorer.getData("commonsoralquestions.json?_properties=dateTabled,AnswerDate&_view=basic&_page=0&_pageSize=50000&answeringDepartment=" + this.answeringBody(), self.retriveQuestionsForAnsweringBody);
            };

            self.dispose = function () {
                self.showInfo.dispose();
            };
        },
        template: htmlText
    }
});