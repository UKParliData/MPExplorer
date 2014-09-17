define(['Scripts/text!modules/questionviewer.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.selectedQuestion = params.selectedQuestion;
            self.answeringBody = ko.observable();
            self.answerDate = ko.observable();
            self.questionText = ko.observable();
            self.isLoading = ko.observable(true);

            self.retriveQuestion = function (data) {
                if ((data != null) && (data.result != null) && (data.result.primaryTopic != null)) {
                    self.answerDate(data.result.primaryTopic.AnswerDate._value);
                    self.answeringBody(data.result.primaryTopic.AnsweringBody);
                    self.questionText(data.result.primaryTopic.questionText);
                }
                self.isLoading(false);
            };

            self.showInfo = ko.computed(function () {
                self.isLoading(true);
                MPExplorer.getData("statutoryinstruments/id/" + self.selectedQuestion().id + ".json?_view=all", self.retriveQuestion);
            });

            self.dispose = function () {
                self.showInfo.dispose();
            };
        },
        template: htmlText
    }
});