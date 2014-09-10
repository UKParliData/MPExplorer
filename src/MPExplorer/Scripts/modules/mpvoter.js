var generateChart = function (selectBar) {
    var values = [
                { date: "2014 Jan", value: 10 },
                { date: "2014 Feb", value: 1 },
                { date: "2014 Mar", value: 20 },
                { date: "2014 Apr", value: 15 },
    ];

    var margin = { top: 30, right: 30, bottom: 30, left: 30 };
    var height = 200-margin.top-margin.bottom;
    var width = $(".chart").parent().width()-margin.left-margin.right;
    var chart = d3.select(".chart").
        attr("height", height + margin.top + margin.bottom).
        attr("width", width + margin.left + margin.right);

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
    var y = d3.scale.linear().range([height, 0]);

    x.domain(values.map(function (d) { return d.date; }));
    y.domain([0, d3.max(values, function (d) { return d.value; })]);

    var bar = chart.selectAll("g").data(values).enter().append("g")
        .attr("transform", function (d) { return "translate(" + x(d.date) + ",0)"; });

    bar.append("rect")
        .on("click", function (d) { selectBar(d); })
        .attr("y", function (d) { return y(d.value); })
        .attr("height", function (d) { return 0; })
        .attr("y", function (d) { return height; })
        .attr("width", x.rangeBand())
        .transition().duration(1500)
        .attr("height", function (d) { return height - y(d.value); })
        .attr("y", function (d) { return y(d.value); });

    bar.append("text").attr("x", x.rangeBand() / 2 - 6)
        .attr("y", function (d) { return y(d.value) + 1; })
        .attr("dy", ".75em")
        .text(function (d) { return d.value; });

    var xAxis = d3.svg.axis().scale(x).orient("bottom");

    chart.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
}

define(['Scripts/knockout-3.2.0.debug', 'Scripts/d3.min', 'Scripts/text!modules/mpvoter.html'], function (ko, d3, htmlText) {
    return {
        viewModel: function (params) {
            var self = this;

            self.selectedMP = params;
            self.selectedVoting = ko.observable(null);

            self.selectVoting = function (data) {
                self.selectedVoting(data);
            };

            generateChart(self.selectVoting);
            
        },
        template: htmlText
    }
});
