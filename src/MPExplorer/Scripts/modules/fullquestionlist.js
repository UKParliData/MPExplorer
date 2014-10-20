define(['Scripts/text!modules/fullquestionlist.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.questions = params.data;
            self.header = params.date;
        },
        template: htmlText
    }
});
