define(['Scripts/text!modules/genericheader.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.header = params.header;
            self.value = params.value;
            self.isLoading = params.isLoading;
        },
        template: htmlText
    }
});
