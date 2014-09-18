define(['Scripts/text!modules/mpselector.html', 'Scripts/select2', 'Scripts/select2BindingHandler'], function (htmlText) {
    var css1 = require.toUrl("Content/css/select2.css");
    var css2 = require.toUrl("Content/select2-bootstrap.css");
    $("head").append($("<link>", { rel: "stylesheet", media: "all", type: "text/css", href: css1 }));
    $("head").append($("<link>", { rel: "stylesheet", media: "all", type: "text/css", href: css2 }));
    return {
        viewModel: function () {
            var self = this;

            self.members = ko.observableArray([]);
            self.selectedMPId = ko.observable(null);
            self.isLoading = ko.observable(true);

            self.selectedMP=ko.pureComputed(function () {
                return ko.utils.arrayFirst(self.members(), function (item) {
                    return item.id == self.selectedMPId();
                });
            });            

            self.showMP = function () {
                if ((self.selectedMPId() != null) && (self.isLoading()==false)) {
                    conductorVM.parameters({ selectedMP: self.selectedMP() });
                    conductorVM.selectedComponent("mp-voter");
                }
            };
            self.retriveMPs=function(data){
                var mps = [];

                mps.push(new MPExplorer.MP("//", "", ""));
                if ((data != null) && (data.result != null) && (data.result.items != null) && (data.result.items.length > 0))
                    for (var i = 0; i < data.result.items.length; i++)
                        mps.push(new MPExplorer.MP(data.result.items[i]._about, data.result.items[i].fullName, data.result.items[i].party));
                self.members(mps);
                self.selectedMPId(null);
                self.isLoading(false);
            };

            MPExplorer.getData("members/commons.json?_properties=fullName,party&_view=basic&_page=0&_pageSize=50000", self.retriveMPs);
        },
        template: htmlText
    }
});
