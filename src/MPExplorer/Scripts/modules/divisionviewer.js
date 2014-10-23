define(['Scripts/text!modules/divisionviewer.html', 'Scripts/d3.min', 'Scripts/topojson.v1.min'], function (htmlText, d3, topojson) {
    return {
        viewModel: function (params) {
            var self = this;

            self.selectedDivision = params.selectedItem;
            self.isLoading = ko.observable(true);
            self.votingParties = ko.observableArray([]);
            self.votingMembers = ko.observableArray([]);
            self.isShowPartyList = ko.observable(true);
            self.partyName = ko.observable(null);
            self.showMapByType = ko.observable(1);
            self.map = null;
            self.mps = [];

            self.retriveDivision = function (data) {
                if ((data != null) && (data.result != null) && (data.result.primaryTopic != null) && (data.result.primaryTopic.vote != null) && (data.result.primaryTopic.vote.length > 0)) {
                    for (var i = 0; i < data.result.primaryTopic.vote.length; i++)
                        self.mps.push({
                            mp: new MPExplorer.MP(data.result.primaryTopic.vote[i].member[0]._about, data.result.primaryTopic.vote[i].memberPrinted, data.result.primaryTopic.vote[i].memberParty, data.result.primaryTopic.vote[i].member[0].gender, data.result.primaryTopic.vote[i].member[0].constituency.label._value),
                            vote: data.result.primaryTopic.vote[i].type.split("#")[1].toUpperCase()
                        });
                    self.refreshParties(
                        data.result.primaryTopic.Noesvotecount,
                        data.result.primaryTopic.AyesCount,
                        data.result.primaryTopic.AbstainCount,
                        data.result.primaryTopic.Didnotvotecount,
                        data.result.primaryTopic.Errorvotecount);                    
                }
                self.isLoading(false);
                self.refreshMap();
            };

            self.refreshMap = function () {
                var className;
                var partyName = self.partyName();
                var showMapByType = self.showMapByType();                    
                
                self.map.selectAll(".constituency").style("fill-opacity", 0).style("fill", "#FFFFFF");
                self.map.selectAll(".bar2").classed("bar2", false);
                for (var i = 0; i < self.mps.length; i++) {
                    //console.log(self.mps[i].mp.id + ":" + self.mps[i].mp.name + ":" + self.mps[i].mp.constituency + ":" + self.mps[i].mp.westminster);
                    if (((showMapByType == 1) ||
                        ((showMapByType == 2) && (self.mps[i].mp.gender.toUpperCase() == "FEMALE")) ||
                        ((showMapByType == 3) && (self.mps[i].mp.gender.toUpperCase() == "MALE"))) &&
                        ((partyName == null) || (self.mps[i].mp.party == partyName))) {
                        if ((self.mps[i].mp.westminster != null) && (self.mps[i].mp.westminster.length > 0)) {
                            className = ".constituency-" + self.mps[i].mp.westminster.split(" ").join("_");
                            if (d3.selection().empty(className) == false) {
                                if (self.mps[i].vote == "AYEVOTE")
                                    self.map.select(className).transition().duration(1500).style("fill-opacity", 1).style("fill", "#008FFA").delay(i * 2);
                                else
                                    if (self.mps[i].vote == "NOVOTE")
                                        self.map.select(className).transition().duration(1500).style("fill-opacity", 1).style("fill", "#FF9E2D").delay(i * 2);
                                    else
                                        if (self.mps[i].vote == "DIDNOTVOTE")
                                            self.map.select(className).transition().duration(1500).style("fill-opacity", 1).style("fill", "#80B8B2").delay(i * 2);
                            }
                        }
                        //else
                          //  console.log(self.mps[i].mp.id + ":" + self.mps[i].mp.name + ":" + self.mps[i].mp.constituency + ":" + self.mps[i].mp.westminster);
                    }
                }
            };

            self.refreshParties = function (noesCount, ayesCount, abstainCount, didNotVoteCount, errorVoteCount) {
                var parties = [];
                var isFound = false;
                var noesCount=0;
                var ayesCount=0;
                var abstainCount=0;
                var didNotVoteCount = 0;
                var errorVoteCount = 0;

                for (var i = 0; i < self.mps.length; i++) {
                    isFound = false;
                    for (var j = 0; j < parties.length; j++)
                        if (parties[j].name == self.mps[i].mp.party) {
                            isFound = true;
                            parties[j].noesCount += self.mps[i].vote == "NOVOTE" ? 1 : 0;
                            parties[j].ayesCount += self.mps[i].vote == "AYEVOTE" ? 1 : 0;
                            parties[j].abstainCount += self.mps[i].vote == "ABSTAINVOTE" ? 1 : 0;
                            parties[j].didNotVoteCount += self.mps[i].vote == "DIDNOTVOTE" ? 1 : 0;
                            parties[j].errorVoteCount += self.mps[i].vote == "ERRORVOTE" ? 1 : 0;
                            parties[j].mps.push({
                                mp: self.mps[i].mp,
                                noesCount: self.mps[i].vote == "NOVOTE" ? 1 : 0,
                                ayesCount: self.mps[i].vote == "AYEVOTE" ? 1 : 0,
                                abstainCount: self.mps[i].vote == "ABSTAINVOTE" ? 1 : 0,
                                didNotVoteCount: self.mps[i].vote == "DIDNOTVOTE" ? 1 : 0,
                                errorVoteCount: self.mps[i].vote == "ERRORVOTE" ? 1 : 0
                            });
                            break;
                        }
                    if (isFound == false)
                        parties.push({
                            index: i,
                            name: self.mps[i].mp.party,
                            noesCount: self.mps[i].vote == "NOVOTE" ? 1 : 0,
                            ayesCount: self.mps[i].vote == "AYEVOTE" ? 1 : 0,
                            abstainCount: self.mps[i].vote == "ABSTAINVOTE" ? 1 : 0,
                            didNotVoteCount: self.mps[i].vote == "DIDNOTVOTE" ? 1 : 0,
                            errorVoteCount: self.mps[i].vote == "ERRORVOTE" ? 1 : 0,
                            mps: [{
                                mp: self.mps[i].mp,
                                noesCount: self.mps[i].vote == "NOVOTE" ? 1 : 0,
                                ayesCount: self.mps[i].vote == "AYEVOTE" ? 1 : 0,
                                abstainCount: self.mps[i].vote == "ABSTAINVOTE" ? 1 : 0,
                                didNotVoteCount: self.mps[i].vote == "DIDNOTVOTE" ? 1 : 0,
                                errorVoteCount: self.mps[i].vote == "ERRORVOTE" ? 1 : 0
                            }]
                        });
                }
                parties.sort(function (left, right) {
                    return left.name === right.name ? left.index - right.index : left.name > right.name ? 1 : -1;
                });
                for (var i = 0; i < parties.length; i++) {
                    noesCount += parties[i].noesCount;
                    ayesCount += parties[i].ayesCount;
                    abstainCount += parties[i].abstainCount;
                    didNotVoteCount += parties[i].didNotVoteCount;
                    errorVoteCount += parties[i].errorVoteCount;
                }
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
                self.refreshMap(self.showMapByType());
            };

            self.showAllParties = function () {
                self.isShowPartyList(true);
                self.partyName(null);
                self.refreshMap(self.showMapByType());
            }

            self.mapAllMembers = function () {
                self.showMapByType(1);
                self.refreshMap();
            };

            self.mapFemales = function () {
                self.showMapByType(2);
                self.refreshMap();
            };

            self.mapMales = function () {
                self.showMapByType(3);
                self.refreshMap();
            };

            self.createMap = function () {
                self.map = d3.select(".westminster");
                
                var width = $(".westminster").parent().width();
                var height = width;

                self.map.attr("width", width).attr("height", height);
                
                var projection = d3.geo.albers()
                    .center([0, 55.4])
                    .rotate([4.4, 0])
                    .parallels([50, 60])
                    .scale(height*5)
                    .translate([width / 2, height / 2]);

                var path = d3.geo.path().projection(projection);

                d3.json('Scripts/modules/westminster.json', function (error, constituencies) {
                    var features = topojson.feature(constituencies, constituencies.objects.westminster).features;                    
                    self.map.selectAll(".constituency")
                        .data(features)
                        .enter()
                        .append("path")
                        .attr("class", function (d) { return "constituency constituency-" + d.properties.FILE_NAME; })
                        .attr("d", path);
                });

                var seriesNames = ["Aye", "No", "Did not vote"];

                var legend = self.map.selectAll(".legend").data(MPExplorer.colours).
                    enter().append("g").attr("class", "legend").
                    attr("transform", function (d, i) { return "translate(-" + (width - 100) + "," + i * 20 + ")"; });

                legend.append("rect")
                    .attr("x", width - 18)
                    .attr("width", 18)
                    .attr("height", 18)
                    .attr("fill", function (d) { return d; });

                legend.append("text")
                    .attr("x", width - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function (d, i) { return seriesNames[i]; });
            };

            self.showInfo = ko.computed(function () {
                self.isLoading(true);
                MPExplorer.getData("commonsdivisions/id/" + self.selectedDivision.id + ".json?_properties=title,vote.type,vote.memberPrinted,vote.memberParty,vote.member,vote.member.memberPrinted,vote.member.constituency.label,vote.member.gender&_view=basic", self.retriveDivision);
                if (self.map == null)
                    self.createMap();
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