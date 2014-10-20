define(['Scripts/text!modules/questionlist.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.date = params.date;
            self.questions = params.data;
            self.questionUrl = params.questionUrl;

            self.showQuestion = function () {
                window.subConductorVM.subParameters({ 
                    selectedItem: this, 
                    questionUrl: self.questionUrl
                });
                window.subConductorVM.selectedSubComponent("question-viewer");
            };
        },
        template: htmlText
    }
});
