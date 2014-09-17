define(['Scripts/text!modules/divisionviewer.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.selectedDivision = params.selectedDivision;            
            self.divisionTitle = ko.observable();
            self.noesCount = ko.observable();
            self.ayesCount = ko.observable();
            self.abstainCount = ko.observable();
            self.didNotVoteCount = ko.observable();
            self.errorVoteCount = ko.observable();
            self.isLoading = ko.observable(true);

            self.retriveDivision = function (data) {
                if ((data != null) && (data.result != null) && (data.result.primaryTopic != null)) {
                    self.divisionTitle(data.result.primaryTopic.title[0]);
                    self.noesCount(data.result.primaryTopic.Noesvotecount);
                    self.ayesCount(data.result.primaryTopic.AyesCount);
                    self.abstainCount(data.result.primaryTopic.AbstainCount);
                    self.didNotVoteCount(data.result.primaryTopic.Didnotvotecount);
                    self.errorVoteCount(data.result.primaryTopic.Errorvotecount);
                }
                self.isLoading(false);
            };
            
            self.showInfo = ko.computed(function () {
                self.isLoading(true);
                MPExplorer.getData("commonsdivisions/id/" + self.selectedDivision().id + ".json", self.retriveDivision);
            });

            self.dispose = function () {
                self.showInfo.dispose();
            };
        },
        template: htmlText
    }
});