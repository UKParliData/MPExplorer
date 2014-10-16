define(['Scripts/text!modules/mpviewer.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.selectedMP = params.selectedMP;
            self.isVotesLoading = params.isVotesLoading;
            self.isOralQuestionsLoading = params.isOralQuestionsLoading;
            self.isWrittenQuestionsLoading = params.isWrittenQuestionsLoading;
            self.numberOfVotes = params.numberOfVotes;
            self.numberOfOralQuestions = params.numberOfOralQuestions;
            self.numberOfWrittenQuestions = params.numberOfWrittenQuestions;
            self.chartSelection = params.chartSelection;

            self.selectMP = function () {
                conductorVM.parameters(null);
                conductorVM.selectedComponent("mp-selector");
            };
        },
        template: htmlText
    }
});
