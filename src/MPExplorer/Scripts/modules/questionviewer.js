var questionAnswerBody = function (urlId, date) {
    var splitUrl = urlId.split("/");
    var idIndex = splitUrl.length - 1;
    if (splitUrl[idIndex] === "")
        idIndex = splitUrl.length - 2;
    this.url = urlId;
    this.id = urlId.split("/")[idIndex];    
    this.date = date;
    this.yearMonth = date.split("-")[0] + " " + MPExplorer.months[date.split("-")[1] - 1];
    this.sortDate = date.split("-")[0] + date.split("-")[1];
}

define(['Scripts/text!modules/questionviewer.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.selectedQuestion = params.selectedQuestion;
            self.answeringBody = ko.observable();
            self.answerDate = ko.observable();
            self.questionText = ko.observable();
            self.title = ko.observable();
            self.isLoading = ko.observable(true);
            self.isAnsweringBodyQuestionsChart = ko.observable(false);
            self.questionsTabled = ko.observableArray([]);
            self.questionsAnswered = ko.observableArray([]);

            self.retriveQuestion = function (data) {
                if ((data != null) && (data.result != null) && (data.result.primaryTopic != null)) {
                    self.answerDate(data.result.primaryTopic.AnswerDate._value);
                    self.answeringBody(data.result.primaryTopic.AnsweringBody);
                    self.questionText(data.result.primaryTopic.questionText);
                    self.title(data.result.primaryTopic.title[0]);
                }
                self.isLoading(false);
            };

            self.showInfo = ko.computed(function () {
                self.isLoading(true);
                self.isAnsweringBodyQuestionsChart(false);
                MPExplorer.getData("statutoryinstruments/id/" + self.selectedQuestion().id + ".json?_view=all", self.retriveQuestion);
            });

            self.barClick = function (data) {
            };

            self.retriveQuestionsForAnsweringBody = function (data) {
                var questionsTabled = [];
                var questionsAnswered = [];
                if ((data != null) && (data.result != null) && (data.result.items != null) && (data.result.items.length > 0))
                    for (var i = 0; i < data.result.items.length; i++)
                        if ((data.result.items[i].dateTabled != null) && (data.result.items[i].AnswerDate != null)) {
                            questionsTabled.push(new questionAnswerBody(data.result.items[i]._about, data.result.items[i].dateTabled._value));
                            questionsAnswered.push(new questionAnswerBody(data.result.items[i]._about, data.result.items[i].AnswerDate._value));
                        }
                self.questionsAnswered(questionsAnswered);
                self.questionsTabled(questionsTabled);
                self.isAnsweringBodyQuestionsChart(true);
            };

            self.showAnsweringBodyQuestions = function () {
                MPExplorer.getData("commonsoralquestions.json?_properties=dateTabled,AnswerDate&_view=basic&_page=0&_pageSize=50000&AnsweringBody=" + this.answeringBody(), self.retriveQuestionsForAnsweringBody);
            };

            self.dispose = function () {
                self.showInfo.dispose();
            };
        },
        template: htmlText
    }
});