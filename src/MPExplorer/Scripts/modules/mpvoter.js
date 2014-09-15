var months=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


var division = function (urlId, divisiondate, isAye) {
    this.id = urlId.substring(urlId.lastIndexOf("/") + 1);
    this.isAye = isAye;
    this.date = divisiondate;
    this.yearMonth = divisiondate.split("-")[0] + " " + months[divisiondate.split("-")[1] - 1];
}

var oralQuestion = function (urlId, dateTabled) {
    this.id = urlId.substring(urlId.lastIndexOf("/") + 1);
    this.date = dateTabled;
    this.yearMonth = dateTabled.split("-")[0] + " " + months[dateTabled.split("-")[1] - 1];
}

var writtenQuestion = function (urlId, dateTabled) {
    this.id = urlId.substring(urlId.lastIndexOf("/") + 1);
    this.date = dateTabled;
    this.yearMonth = dateTabled.split("-")[0] + " " + months[dateTabled.split("-")[1] - 1];
}

define(['Scripts/d3.min', 'Scripts/text!modules/mpvoter.html'], function (d3, htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.selectedMP = params.selectedMP;
            self.selectedVoting = ko.observable(params.selectedVoting);
            self.chartHeader=ko.observable(null);
            self.dataset = ko.observableArray([]);

            self.barClick = function (data) {
                self.selectedVoting(data);
            };

            self.chartSelection = function (selectedChart) {
                if (selectedChart == 1) {
                    self.chartHeader("Number of votes per calendar month");
                    self.dataset(self.divisions);
                }
                if (selectedChart == 2) {
                    self.chartHeader("Number of oral questions per calendar month");
                    self.dataset(self.oralQuestions);
                }
                if (selectedChart == 3) {
                    self.chartHeader("Number of written questions per calendar month");
                    self.dataset(self.writtenQuestions);
                }
            };

            self.numberOfVotes = ko.observable();
            self.numberOfOralQuestions = ko.observable();
            self.numberOfWrittenQuestions = ko.observable();
            self.divisions = [];
            self.oralQuestions = [];
            self.writtenQuestions = [];

            $.get("http://url/commonsdivisions/aye.json?_properties=divisiondate&_view=basic&_page=0&_pageSize=50000&mnisId=" + params.selectedMP.id)
            .done(function (ayes) {
                toastr.info("http://url/commonsdivisions/aye.json?_properties=divisiondate&_view=basic&_page=0&_pageSize=50000&mnisId=" + params.selectedMP.id);
                $.get("http://url/commonsdivisions/no.json?_properties=divisiondate&_view=basic&_page=0&_pageSize=50000&mnisId=" + params.selectedMP.id)
                .done(function (noes) {
                    var divisions = [];
                    toastr.info("http://url/commonsdivisions/no.json?_properties=divisiondate&_view=basic&_page=0&_pageSize=50000&mnisId=" + params.selectedMP.id);
                    var populateDivisions = function (data, isAye) {
                        if ((data != null) && (data.result != null) && (data.result.items != null) && (data.result.items.length > 0))
                            for (var i = 0; i < data.result.items.length; i++)
                                if ((data.result.items[i].divisiondate != null) && (data.result.items[i].divisiondate.length > 0))
                                    for (var j = 0; j < data.result.items[i].divisiondate.length; j++)
                                        divisions.push(new division(data.result.items[i]._about, data.result.items[i].divisiondate[j]._value, isAye));
                    }

                    populateDivisions(ayes, true);
                    populateDivisions(noes, false);
                    self.numberOfVotes(divisions.length);
                    self.divisions = divisions;
                });
            });

            $.get("http://url/commonsoralquestions.json?_properties=dateTabled&_view=basic&_page=0&_pageSize=50000&mnisId=" + params.selectedMP.id, function (data) {
                var questions = [];
                toastr.info("http://url/commonsoralquestions.json?_properties=dateTabled&_view=basic&_page=0&_pageSize=50000&mnisId=" + params.selectedMP.id);
                if ((data != null) && (data.result != null) && (data.result.items != null) && (data.result.items.length > 0))
                    for (var i = 0; i < data.result.items.length; i++)
                        if ((data.result.items[i].dateTabled != null) && (data.result.items[i].dateTabled._value!=null))
                            questions.push(new oralQuestion(data.result.items[i]._about, data.result.items[i].dateTabled._value));
                self.numberOfOralQuestions(questions.length);
                self.oralQuestions = questions;
            });

            $.get("http://url/commonswrittenquestions.json?_properties=dateTabled&_view=basic&_page=0&_pageSize=50000&mnisId=" + params.selectedMP.id, function (data) {
                var questions = [];
                toastr.info("http://url/commonswrittenquestions.json?_properties=dateTabled&_view=basic&_page=0&_pageSize=50000&mnisId=" + params.selectedMP.id);
                if ((data != null) && (data.result != null) && (data.result.items != null) && (data.result.items.length > 0))
                    for (var i = 0; i < data.result.items.length; i++)
                        if ((data.result.items[i].dateTabled != null) && (data.result.items[i].dateTabled._value != null))
                            questions.push(new writtenQuestion(data.result.items[i]._about, data.result.items[i].dateTabled._value));
                self.numberOfWrittenQuestions(questions.length);
                self.writtenQuestions = questions;
            });


        },
        template: htmlText
    }
});
