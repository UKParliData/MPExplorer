var generateChart = function (selectBar) {
    var values = [
                { date: "2014 Jan", value: 10, isAye: true },
                { date: "2014 Jan", value: 20, isAye: false },
                { date: "2014 Feb", value: 1, isAye: true },
                { date: "2014 Feb", value: 5, isAye: false },
                { date: "2014 Mar", value: 20, isAye: true },
                { date: "2014 Mar", value: 2, isAye: false },
                { date: "2014 Apr", value: 15, isAye: true },
                { date: "2014 Apr", value: 15, isAye: false }
    ];

    var totals = [];
    var isFound = false;

    for (var i = 0; i < values.length; i++) {
        isFound = false;
        for (j = 0; j < totals.length; j++)
            if (totals[j].date == values[i].date) {
                totals[j].value += values[i].value;
                if (values[i].isAye)
                    totals[j].aye = values[i].value;
                else
                    totals[j].no = values[i].value;
                isFound = true;
                break;
            }
        if (isFound == false)
            totals.push({
                date: values[i].date,
                value: values[i].value,
                aye: values[i].isAye ? values[i].value : 0,
                no: values[i].isAye ? 0 : values[i].value
            });
    }

    var margin = { top: 30, right: 30, bottom: 30, left: 30 };
    var height = 200-margin.top-margin.bottom;
    var width = $(".chart").parent().width()-margin.left-margin.right;
    var chart = d3.select(".chart").
        attr("height", height + margin.top + margin.bottom).
        attr("width", width + margin.left + margin.right);

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
    var y = d3.scale.linear().range([height, 0]);

    x.domain(totals.map(function (d) { return d.date; }));
    y.domain([0, d3.max(totals, function (d) { return d.value; })]);

    var bar = chart.selectAll("g").data(totals).enter().append("g")
        .attr("transform", function (d) { return "translate(" + x(d.date) + ",0)"; });

    bar.append("rect")
        .on("click", function (d) { selectBar(d); })
        .attr("class", "ayebar")
        .attr("height", function (d) { return 0; })
        .attr("y", function (d) { return height; })
        .attr("width", x.rangeBand())
        .transition().duration(1500)
        .attr("height", function (d) { return height - y(d.aye); })
        .attr("y", function (d) { return y(d.aye); });

    bar.append("rect")        
        .on("click", function (d) { selectBar(d); })
        .attr("class", "nobar")
        .attr("height", function (d) { return height - y(d.aye); })
        .attr("y", function (d) { return y(d.aye); })
        .attr("width", x.rangeBand())
        .transition().duration(1500)
        .attr("height", function (d) { return height - y(d.no); })
        .attr("y", function (d) { return height - ((height - y(d.aye)) + (height - y(d.no))); });    
    
    var xAxis = d3.svg.axis().scale(x).orient("bottom");

    chart.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
}

define(['Scripts/d3.min', 'Scripts/text!modules/mpvoter.html'], function (d3, htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.selectedMP = params.selectedMP;            
            self.selectedVoting = ko.observable(params.selectedVoting);

            self.selectVoting = function (data) {
                self.selectedVoting(data);
            };

            generateChart(self.selectVoting);
            
        },
        template: htmlText
    }
});
