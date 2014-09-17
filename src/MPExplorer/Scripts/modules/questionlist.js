define(['Scripts/text!modules/questionlist.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.date = params.date;
            self.questions = params.questions;            
            self.selectedQuestion = ko.observable(null);

            self.showQuestion = function () {
                self.selectedQuestion(this);
            };
        },
        template: htmlText
    }
});
