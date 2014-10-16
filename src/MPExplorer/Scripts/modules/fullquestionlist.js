define(['Scripts/text!modules/fullquestionlist.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.questions = params.questions;
            self.header = params.header;
            self.isLoading = params.isLoading;            
        },
        template: htmlText
    }
});
