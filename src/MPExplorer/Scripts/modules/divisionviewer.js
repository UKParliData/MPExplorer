define(['Scripts/text!modules/divisionviewer.html'], function (htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.selectedDivision = params.selectedDivision;
            self.divisionTitle = ko.observable();
            self.isLoading = ko.observable(true);
            self.votingParties = ko.observableArray([]);
            self.votingMembers = ko.observableArray([]);
            self.isShowPartyList = ko.observable(true);
            self.partyName = ko.observable();

            self.retriveDivision = function (data) {
                if ((data != null) && (data.result != null) && (data.result.primaryTopic != null) && (data.result.primaryTopic.vote != null) && (data.result.primaryTopic.vote.length > 0)) {
                    self.divisionTitle(data.result.primaryTopic.fullTitle);
                    var mps = [];
                    for (var i = 0; i < data.result.primaryTopic.vote.length; i++)
                        mps.push({
                            mp: new MPExplorer.MP(data.result.primaryTopic.vote[i].member[0], data.result.primaryTopic.vote[i].memberPrinted, data.result.primaryTopic.vote[i].memberParty),
                            vote: data.result.primaryTopic.vote[i].type.split("#")[1].toUpperCase()
                        });
                    self.refreshParties(mps,
                        data.result.primaryTopic.Noesvotecount,
                        data.result.primaryTopic.AyesCount,
                        data.result.primaryTopic.AbstainCount,
                        data.result.primaryTopic.Didnotvotecount,
                        data.result.primaryTopic.Errorvotecount);
                }
                self.isLoading(false);
            };

            self.refreshParties = function (mps, noesCount, ayesCount, abstainCount, didNotVoteCount, errorVoteCount) {
                var parties = [];
                var isFound = false;

                for (var i = 0; i < mps.length; i++) {
                    isFound = false;
                    for (var j = 0; j < parties.length; j++)
                        if (parties[j].name == mps[i].mp.party) {
                            isFound = true;
                            parties[j].noesCount += mps[i].vote == "NOVOTE" ? 1 : 0;
                            parties[j].ayesCount += mps[i].vote == "AYEVOTE" ? 1 : 0;
                            parties[j].abstainCount += mps[i].vote == "ABSTAINVOTE" ? 1 : 0;
                            parties[j].didNotVoteCount += mps[i].vote == "DIDNOTVOTE" ? 1 : 0;
                            parties[j].errorVoteCount += mps[i].vote == "ERRORVOTE" ? 1 : 0;
                            parties[j].mps.push({
                                mp: mps[i].mp,
                                noesCount: mps[i].vote == "NOVOTE" ? 1 : 0,
                                ayesCount: mps[i].vote == "AYEVOTE" ? 1 : 0,
                                abstainCount: mps[i].vote == "ABSTAINVOTE" ? 1 : 0,
                                didNotVoteCount: mps[i].vote == "DIDNOTVOTE" ? 1 : 0,
                                errorVoteCount: mps[i].vote == "ERRORVOTE" ? 1 : 0
                            });
                            break;
                        }
                    if (isFound == false)
                        parties.push({
                            index: i,
                            name: mps[i].mp.party,
                            noesCount: mps[i].vote == "NOVOTE" ? 1 : 0,
                            ayesCount: mps[i].vote == "AYEVOTE" ? 1 : 0,
                            abstainCount: mps[i].vote == "ABSTAINVOTE" ? 1 : 0,
                            didNotVoteCount: mps[i].vote == "DIDNOTVOTE" ? 1 : 0,
                            errorVoteCount: mps[i].vote == "ERRORVOTE" ? 1 : 0,
                            mps: [{
                                mp: mps[i].mp,
                                noesCount: mps[i].vote == "NOVOTE" ? 1 : 0,
                                ayesCount: mps[i].vote == "AYEVOTE" ? 1 : 0,
                                abstainCount: mps[i].vote == "ABSTAINVOTE" ? 1 : 0,
                                didNotVoteCount: mps[i].vote == "DIDNOTVOTE" ? 1 : 0,
                                errorVoteCount: mps[i].vote == "ERRORVOTE" ? 1 : 0
                            }]
                        });
                }
                parties.sort(function (left, right) {
                    return left.name === right.name ? left.index - right.index : left.name > right.name ? 1 : -1;
                });
                parties.unshift({
                    index: -1,
                    name: "All",
                    noesCount: noesCount,
                    ayesCount: ayesCount,
                    abstainCount: abstainCount,
                    didNotVoteCount: didNotVoteCount,
                    errorVoteCount: errorVoteCount
                });
                self.votingParties(parties);
            };

            self.showPartyList = function () {
                self.partyName(this.name);
                var mps = this.mps;
                mps.sort(function (left, right) {
                    return left.name === right.name ? left.index - right.index : left.name > right.name ? 1 : -1;
                });
                self.votingMembers(mps);
                self.isShowPartyList(false);
            };

            self.showInfo = ko.computed(function () {
                self.isLoading(true);
                MPExplorer.getData("commonsdivisions/id/" + self.selectedDivision().id + ".json", self.retriveDivision);
            });

            self.showMP = function () {
                conductorVM.parameters({ selectedMP: this.mp });
                conductorVM.selectedComponent("mp-voter");
            };

            self.dispose = function () {
                self.showInfo.dispose();
            };
        },
        template: htmlText
    }
});