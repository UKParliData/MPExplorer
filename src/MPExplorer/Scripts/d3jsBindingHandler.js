﻿var generateChart = function (chartId, values, selectBar) {
    var totals = [];
    var isFound = false;
    var categories = [];
    var isAyeNo = (values != null) && (values.length > 0) && (values[0].isAye != null);

    for (var i = 0; i < values.length; i++) {
        isFound = false;
        for (j = 0; j < totals.length; j++)
            if (totals[j].date === values[i].yearMonth) {
                totals[j].value += 1;
                if (isAyeNo) {
                    if (values[i].isAye)
                        totals[j].aye += 1;
                    else
                        totals[j].no += 1;
                }
                isFound = true;
                break;
            }
        if (isFound == false)
            totals.push({
                sortDate: values[i].sortDate,
                date: values[i].yearMonth,
                value: 1,
                aye: isAyeNo ? values[i].isAye ? 1 : 0 : null,
                no: isAyeNo ? values[i].isAye ? 0 : 1 : null,
                index: i
            });
    }

    totals.sort(function (left, right) {
        return left.sortDate === right.sortDate ? left.index - right.index : left.sortDate > right.sortDate ? 1 : -1;
    });

    var maxValue = 0;
    for (var i = 0; i < totals.length; i++) {
        if (totals[i].value > maxValue)
            maxValue = totals[i].value;
        if ((Math.floor(totals.length / 10) == 0) || (i % Math.floor(totals.length / 10) == 0))
            categories.push(totals[i].date);
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
        .attr("height", function (d) { return height - (isAyeNo ? y(d.aye) : y(d.value)); })
        .attr("y", function (d) { return isAyeNo ? y(d.aye) : y(d.value); });

    if (isAyeNo) {
        bar.append("rect")
            .on("click", function (d) { selectBar(d); })
            .attr("class", "nobar")
            .attr("height", function (d) { return height - y(d.aye); })
            .attr("y", function (d) { return y(d.aye); })
            .attr("width", x.rangeBand())
            .transition().duration(1500)
            .attr("height", function (d) { return height - y(d.no); })
            .attr("y", function (d) { return height - ((height - y(d.aye)) + (height - y(d.no))); });
    }

    var xAxis = d3.svg.axis().tickValues(categories).scale(x).orient("bottom");
    var yAxis = d3.svg.axis().tickValues([Math.floor(maxValue / 2), maxValue]).tickFormat(d3.format("d")).scale(y).orient("left");

    chart.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
    chart.append("g").attr("class", "y axis").call(yAxis);

}

ko.bindingHandlers.d3js = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var allBindings = allBindingsAccessor();        
        generateChart(allBindings.d3js.chartId(), allBindings.d3js.data(), allBindings.d3js.clickCallback);
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var allBindings = allBindingsAccessor();
        generateChart(allBindings.d3js.chartId(), allBindings.d3js.data(), allBindings.d3js.clickCallback);
    }
};