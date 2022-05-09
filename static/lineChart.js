var outerWidthLine = 1080,
    outerHeightLine = 420
var marginUpperLineChart = { top: 100, right: 300, bottom: 100, left: 140 }
var marginBottomLineChart = { top: 255, right: 300, bottom: 50, left: 40 }
var innerWidthLine = outerWidthLine - marginUpperLineChart.left - marginUpperLineChart.right - 10
var innerHeightLine = outerHeightLine - marginUpperLineChart.top - marginUpperLineChart.bottom - 20

function createLineChart(lineChartData, selectedAttr) {
    console.log("==============================");
    console.log("entered line chart method");
    console.log(lineChartData);
    console.log("===============");
    // console.log(selectedAttr);

    data = lineChartData
    
    document.getElementById("linechart").innerHTML = "";

    var plotOuter = d3.select("#linechart")
        .append("svg")
        .attr("width", outerWidthLine)
        .attr("height", outerHeightLine)

    plotInner = plotOuter
        .append('g')
        .attr('id', 'inner-plot')
        .attr('width', innerWidthLine)
        // .attr('class', 'linebubblechart')
        .attr('height', innerHeightLine)
        .attr('transform', 'translate(' + marginUpperLineChart.left + ',' + marginUpperLineChart.top + ')')

    // margin = marginUpperLineChart,
    //     margin2 = marginBottomLineChart,
    //     width = outerWidthLine - margin.left - margin.right,
    //     height = outerHeightLine - margin.top - margin.bottom,
    //     height2 = outerHeightLine - margin2.top - margin2.bottom;


    xdata_min = d3.min(lineChartData, function(d) { return d["year"]; });
    xdata_max = d3.max(lineChartData, function(d) { return d["year"]; });
    console.log("xdata_min:" + xdata_min);
    console.log("xdata_max:" + xdata_max);


    // var xScale = d3.scaleLinear().range([0, width]).domain([xdata_min-0.1*xdata_min, xdata_max+0.1*xdata_min])
    var xScale = d3.scaleLinear().range([0, innerWidthLine]).domain([xdata_min-0.001*xdata_min, xdata_max+0.001*xdata_min])

    // For Crop production idx
    // selectedAttr = "GDP per capita (current US$)", "Food production index (2004-2006 = 100)", "Crop production index (2004-2006 = 100)"

    selectedAttr = "Agricultural land (% of land area)"
    agri_linedata_max = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })
    agri_linedata_min = d3.min(lineChartData, function(d) { return +d[selectedAttr]; })

    selectedAttr = "Crop production index (2004-2006 = 100)"
    crop_linedata_max = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })
    crop_linedata_min = d3.min(lineChartData, function(d) { return +d[selectedAttr]; })

    selectedAttr = "Food production index (2004-2006 = 100)"
    food_linedata_max = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })
    food_linedata_min = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })

    linedata_min = Math.min(agri_linedata_min, crop_linedata_min, food_linedata_max)
    linedata_max = Math.max(agri_linedata_max, crop_linedata_max, food_linedata_max)

    console.log("linedata_min:", linedata_min);
    console.log("linedata_max:", linedata_max);

    // var yScale = d3.scaleLinear().range([height, 0]).domain([linedata_min-0.1*linedata_min, linedata_max+0.1*linedata_min])
    var yScale = d3.scaleLinear().range([innerHeightLine, 0]).domain([linedata_min-0.01*linedata_min, linedata_max+0.01*linedata_min])


    plotInner.append("g")
        .attr("transform", "translate(0," + innerHeightLine + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        // .attr("y", margins.bottom / 2)
        .attr("y", marginBottomLineChart.bottom)
        // .attr("x", innerWidth / 2)
        .attr("x", innerWidthLine/2)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("fill", "black")
        .attr("font-size", "15px")
        .text("Year");

    plotInner.append("g")
        .call(d3.axisLeft(yScale)
        .tickFormat(function(d) {
            // return d*100 + '%';
            return d;
        }).ticks(10)
        )
        .append("text")
        .attr("transform", "rotate(-90)")
        // .attr("y", margins.left / 2 - 20)
        .attr("y", 10)
        // .attr("x", - innerHeight / 2 + 100)
        .attr("x", 50)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("fill", "black")
        .attr("font-size", "12px")
        // .text(selectedAttr);
        .text("Selected Attributes in %");


    plotOuter.append("text")
        // .attr("x", outerWidth/4 - margins.right)
        // .attr("x", outerWidthLine/4 - marginUpperLineChart.right)
        .attr("x", 100)
        // .attr("y", margins.top/2)
        .attr("y", 30)
        .attr("font-size", "22px")
        .text("Line Chart for attributes")
    


    selectedAttr = "Crop production index (2004-2006 = 100)"
    const line1 = d3.line()
        // .x(d => xScale(d.x)+xScale.bandwidth()/2)
        // .x(d => xScale(d.x)+3)
        .x(d => xScale(d["year"]) + 3)
        // .y(d => yScale(d.y))
        .y(d => yScale(d["Crop production index (2004-2006 = 100)"]))
        // .style({ 'stroke-width': '2px' })
        .curve(d3.curveLinear)


    // selectedAttr = "Food production index (2004-2006 = 100)"
    selectedAttr = "Agricultural land (% of land area)"
    const line2 = d3.line()
        // .x(d => xScale(d.x)+xScale.bandwidth()/2)
        // .x(d => xScale(d.x)+3)
        .x(d => xScale(d["year"]) + 3)
        // .y(d => yScale(d.y))
        .y(d => yScale(d["Agricultural land (% of land area)"]))
        .curve(d3.curveLinear)


    // selectedAttr = "Food production index (2004-2006 = 100)"
    const line3 = d3.line()
        // .x(d => xScale(d.x)+xScale.bandwidth()/2)
        // .x(d => xScale(d.x)+3)
        .x(d => xScale(d["year"]) + 3)
        // .y(d => yScale(d.y))
        .y(d => yScale(d["Food production index (2004-2006 = 100)"]))
        .curve(d3.curveLinear)


    plotInner.append('path')
        // .datum(data)
        .datum(lineChartData)
        .attr('d', line1)
        .attr('fill', 'none')
        .attr('stroke', 'teal')
        .attr('stroke-width', '2')

    plotInner.append('path')
        // .datum(data)
        .datum(lineChartData)
        .attr('d', line2)
        .attr('fill', 'none')
        .attr('stroke', 'orange')
        .attr('stroke-width', '2')
    
    plotInner.append('path')
        // .datum(data)
        .datum(lineChartData)
        .attr('d', line3)
        .attr('fill', 'none')
        .attr('stroke', 'yellow')
        .attr('stroke-width', '2')

}

