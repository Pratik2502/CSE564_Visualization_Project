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



    xdata_min = d3.min(lineChartData, function(d) { return d["year"]; });
    xdata_max = d3.max(lineChartData, function(d) { return d["year"]; });
    console.log("xdata_min:" + xdata_min);
    console.log("xdata_max:" + xdata_max);

    var xScale = d3.scaleLinear().range([0, innerWidthLine]).domain([xdata_min-0.001*xdata_min, xdata_max+0.001*xdata_min])

    selectedAttr = "agricultural_land_percent"
    agri_linedata_max = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })
    agri_linedata_min = d3.min(lineChartData, function(d) { return +d[selectedAttr]; })

    selectedAttr = "crop_production_index"
    crop_linedata_max = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })
    crop_linedata_min = d3.min(lineChartData, function(d) { return +d[selectedAttr]; })

    selectedAttr = "food_production_index"
    food_linedata_max = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })
    food_linedata_min = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })

    linedata_min = Math.min(agri_linedata_min, crop_linedata_min, food_linedata_min)
    linedata_max = Math.max(agri_linedata_max, crop_linedata_max, food_linedata_max)

    console.log("linedata_min:", linedata_min);
    console.log("linedata_max:", linedata_max);


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
        // .attr("stroke", "white")
        .attr("fill", "white")
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
        // .attr("stroke", "white")
        .attr("fill", "white")
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
        .attr("fill", "white")
        .text("Line Chart for attributes")
    

    selectedAttr = "crop_production_index"
    const line1 = d3.line()
        // .x(d => xScale(d.x)+xScale.bandwidth()/2)
        // .x(d => xScale(d.x)+3)
        .x(d => xScale(d["year"]) + 3)
        // .y(d => yScale(d.y))
        .y(d => yScale(d["crop_production_index"]))
        // .style({ 'stroke-width': '2px' })
        .curve(d3.curveLinear)
    
    
    // selectedAttr = "food_production_index"
    selectedAttr = "agricultural_land_percent"
    const line2 = d3.line()
        // .x(d => xScale(d.x)+xScale.bandwidth()/2)
        // .x(d => xScale(d.x)+3)
        .x(d => xScale(d["year"]) + 3)
        // .y(d => yScale(d.y))
        .y(d => yScale(d["agricultural_land_percent"]))
        .curve(d3.curveLinear)


    // selectedAttr = "food_production_index"
    const line3 = d3.line()
        // .x(d => xScale(d.x)+xScale.bandwidth()/2)
        // .x(d => xScale(d.x)+3)
        .x(d => xScale(d["year"]) + 3)
        // .y(d => yScale(d.y))
        .y(d => yScale(d["food_production_index"]))
        .curve(d3.curveLinear)

    console.log("--------------------------")
    // console.log($('#cropProdIdx').value)
    
    





    // Tooltip for circles
    var circleTipLineChart = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            // console.log(d);
            const currattr = d["Attribute"]
            return "<strong>" + currattr + " : </strong><span class='details'>" + d["dataObj"][currattr] + "<br></span>";
        });
    plotInner.call(circleTipLineChart);


    // Circles in line chart

    var circleData = []
    lineChartData.forEach(d => {
        let newObj = {}
        newObj["cx"] = xScale(d["year"]) + 3
        newObj["cy"] = yScale(d["crop_production_index"])
        newObj["fill"] = 'teal'
        newObj["Attribute"] = "crop_production_index"
        newObj["dataObj"] = d
        circleData.push(newObj)
    });

    lineChartData.forEach(d => {
        let newObj = {}
        newObj["cx"] = xScale(d["year"]) + 3
        newObj["cy"] = yScale(d["food_production_index"])
        newObj["fill"] = 'yellow'
        newObj["Attribute"] = "food_production_index"
        newObj["dataObj"] = d
        circleData.push(newObj)
    });

    lineChartData.forEach(d => {
        let newObj = {}
        newObj["cx"] = xScale(d["year"]) + 3
        newObj["cy"] = yScale(d["agricultural_land_percent"])
        newObj["fill"] = 'orange'
        newObj["Attribute"] = "agricultural_land_percent"
        newObj["dataObj"] = d
        circleData.push(newObj)
    });

    function handleMouseOverCircle(d) {
        circleTipLineChart.show(d);
    }

    function handleMouseOutCircle(d) {
        circleTipLineChart.hide(d);
    }

    var points = plotInner.selectAll("circles")
            .data(circleData)
            .enter()
            .append("circle")
            // .attr("class", function(d) { "point" + d["Attribute"] })
            .attr("class", function(d) { return "point_" + d["Attribute"] })
            .attr("cx", function(d) { return d["cx"]; })
            .attr("cy", function(d) { return d["cy"]; })
            .attr("r", 8)
            // .attr("visibility", "hidden")
            .attr("opacity", 0)
            .style("fill", function(d) { return d["fill"]; })
            .style('cursor', 'pointer')
            .on("mouseover", handleMouseOverCircle)
            .on("mouseout", handleMouseOutCircle)
            // .on("click", handleClick)

        // plotInner.selectAll("circles")
        //     .data(mds_corr_data)
        //     .enter()
        //     .append("text")
        //     .text(function(d){ return d.short_names; })
        //     .attr("x", function(d) { return xScale(d.x); })
        //     .attr("y", function(d) { return yScale(d.y); })
        //     .style("font-weight", "bold")






    if(document.getElementById("cropProdIdx").checked) {
        plotInner.append('path')
            // .datum(data)
            .datum(lineChartData)
            .attr('d', line1)
            .attr('fill', 'none')
            .attr('stroke', 'teal')
            .attr('stroke-width', '2')
        
        // plotInner.selectAll('.pointcrop_production_index').style("visibility", "hidden")
        plotInner.selectAll(".point_crop_production_index")
            .attr("opacity", 1)
    }
    
    if(document.getElementById("foodProdIdx").checked) {
        plotInner.append('path')
            // .datum(data)
            .datum(lineChartData)
            .attr('d', line2)
            .attr('fill', 'none')
            .attr('stroke', 'orange')
            .attr('stroke-width', '2')
        
        plotInner.selectAll(".point_food_production_index")
            .attr("opacity", 1)
    }
    
    if(document.getElementById("gdp").checked) {
        plotInner.append('path')
            // .datum(data)
            .datum(lineChartData)
            .attr('d', line3)
            .attr('fill', 'none')
            .attr('stroke', 'yellow')
            .attr('stroke-width', '2')
        
        // agricultural_land_percent
        plotInner.selectAll(".point_agricultural_land_percent")
            .attr("opacity", 1)
    }


    worldMapTrigger.registerListener(function(val) {
        resetLineChart()
    });

}

