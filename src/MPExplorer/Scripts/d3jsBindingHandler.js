var generateChart = function (chartId, data, selectBarCallback, isStackedType, seriesNames) {
    var totals = [];
    var isFound = false;
    var categories = [];
    
    if ((data == null) || ((data != null) && (data.length == 0)))
        return;

    var seriesCount = data[0].values.length;
    var maxValue = d3.max(data, function (d) { return isStackedType ? d3.sum(d.values) : d3.max(d.values); });
    
    for (var i = 0; i < data.length; i++) {
        if ((Math.floor(data.length / 10) == 0) || (i % Math.floor(data.length / 10) == 0))
            categories.push(data[i].categoryValue);
    }

    var margin = { top: 30, right: 30, bottom: 30, left: 30 };
    var height = 200 - margin.top - margin.bottom;
    var width = $("#" + chartId).parent().width() - margin.left - margin.right;

    $("#" + chartId).empty();
    var chart = d3.select("#" + chartId).
        attr("height", height + margin.top + margin.bottom).
        attr("width", width + margin.left + margin.right).
        append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
    var y = d3.scale.linear().range([height, 0]);

    x.domain(data.map(function (d) { return d.categoryValue; }));
    y.domain([0, maxValue]);
    
    var bar = chart.selectAll("g").data(data).enter().append("g")
        .attr("transform", function (d) { return "translate(" + x(d.categoryValue) + ",0)"; });

    for (var i = 0; i < seriesCount; i++) {
        bar.append("rect")
            .on("click", function (d) { selectBarCallback(d); })
            .attr("class", "bar" + (i + 1).toString())
            .attr("height", function (d) { return isStackedType ? i == 0 ? 0 : height - y(d.values[i - 1]) : 0; })
            .attr("y", function (d) { return isStackedType ? i == 0 ? height : y(d.values[i - 1]) : height; })
            .attr("x", isStackedType ? 0 : i == 0 ? 0 : x.rangeBand() - (i * (x.rangeBand() / seriesCount)))
            .attr("width", isStackedType ? x.rangeBand() : (x.rangeBand() / seriesCount) - 1)
            .transition().duration(1500)
            .attr("height", function (d) { return height - y(d.values[i]); })
            .attr("y", function (d) { return isStackedType ? height - (d3.sum(d.values.slice(0, i + 1), function (v) { return height - y(v); })) : y(d.values[i]); });
    }
    
    var colors = MPExplorer.colours.slice(0, seriesCount);

    var legend = chart.selectAll(".legend").data(colors).enter().append("g")
      .attr("class", "legend").attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

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

    var xAxis = d3.svg.axis().tickValues(categories).scale(x).orient("bottom");
    var yAxis = d3.svg.axis().tickValues([Math.floor(maxValue / 2), maxValue]).tickFormat(d3.format("d")).scale(y).orient("left");

    chart.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
    chart.append("g").attr("class", "y axis").call(yAxis);

}

ko.bindingHandlers.d3js = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var allBindings = allBindingsAccessor();        
        generateChart(ko.unwrap(allBindings.d3js.chartId), ko.unwrap(allBindings.d3js.data), allBindings.d3js.clickCallback, ko.unwrap(allBindings.d3js.isStackedType), ko.unwrap(allBindings.d3js.seriesNames));
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var allBindings = allBindingsAccessor();
        generateChart(ko.unwrap(allBindings.d3js.chartId), ko.unwrap(allBindings.d3js.data), allBindings.d3js.clickCallback, ko.unwrap(allBindings.d3js.isStackedType), ko.unwrap(allBindings.d3js.seriesNames));
    }
};
