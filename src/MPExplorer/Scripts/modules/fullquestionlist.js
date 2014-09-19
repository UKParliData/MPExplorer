define(['Scripts/text!modules/fullquestionlist.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.questions = params.questions;
            self.header = params.header;
            self.isLoading = params.isLoading;

            self.retriveMP = function () {
                var mp = null;

                if ((data != null) && (data.result != null) && (data.result.items != null) && (data.result.items.length > 0))
                    for (var i = 0; i < data.result.items.length; i++)
                        mp = new MPExplorer.MP(data.result.items[i]._about, data.result.items[i].fullName, data.result.items[i].party);
                if (mp != null) {
                    conductorVM.parameters({ selectedMP: mp });
                    conductorVM.selectedComponent("mp-voter");
                }
            };

            self.showMP = function () {
                MPExplorer.getData("members/commons.json?_properties=fullName,party&_view=basic&_page=0&_pageSize=50000&mnisId=" + this.memberId, self.retriveMP);
            };
        },
        template: htmlText
    }
});
