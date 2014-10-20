define(['Scripts/text!modules/mpselector.html', 'Scripts/selectize', 'Scripts/selectizeBindingHandler'], function (htmlText) {
    var css1 = require.toUrl("Content/selectize.css");
    var css2 = require.toUrl("Content/selectize.bootstrap3.css");
    $("head").append($("<link>", { rel: "stylesheet", media: "all", type: "text/css", href: css1 }));
    $("head").append($("<link>", { rel: "stylesheet", media: "all", type: "text/css", href: css2 }));
    return {
        viewModel: function () {
            var self = this;

            self.members = ko.observableArray([]);
            self.selectedMPId = ko.observable(null);
            self.isLoading = ko.observable(true);
            
            self.showMP = ko.computed(function () {
                var mp = ko.utils.arrayFirst(self.members(), function (item) {
                    return item.id == self.selectedMPId();
                });
                if ((mp != null) && (self.isLoading() == false)) {
                    conductorVM.parameters({ selectedMP: mp });
                    conductorVM.selectedComponent("mp-voter");
                }
            });

            self.retriveMPs=function(data){
                var mps = [];

                if (sessionStorage)
                    sessionStorage.setItem("mps", JSON.stringify(data));
                if ((data != null) && (data.result != null) && (data.result.items != null) && (data.result.items.length > 0))
                    for (var i = 0; i < data.result.items.length; i++)
                        mps.push(new MPExplorer.MP(data.result.items[i]._about, data.result.items[i].fullName, data.result.items[i].party, data.result.items[i].gender, data.result.items[i].constituency));                
                self.members(mps);
                self.isLoading(false);
            };

            self.dispose = function () {
                self.showMP.dispose();
            };

            self.init = function () {
                var isFound = false;
                if (sessionStorage) {
                    var mps = sessionStorage.getItem("mps");
                    if ((mps != null) && (mps != "")) {
                        self.retriveMPs(JSON.parse(mps));
                        isFound = true;
                    }
                }
                if (isFound == false)
                    MPExplorer.getData("members/commons.json?_properties=fullName,party,gender,constituency&_view=basic&_page=0&_pageSize=50000", self.retriveMPs);
            }

            self.init();

        },
        template: htmlText
    }
});
