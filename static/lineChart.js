var outerWidthLine = 980,
    outerHeightLine = 485
var marginUpperLineChart = { top: 90, right: 90, bottom: 30, left: 170 }
var marginBottomLineChart = { top: 255, right: 300, bottom: 50, left: 40 }
var innerWidthLine = outerWidthLine - marginUpperLineChart.left - marginUpperLineChart.right
var innerHeightLine = outerHeightLine - marginUpperLineChart.top - marginUpperLineChart.bottom - 20

function clickedLabel(event) {
    console.log("this was called")
    let currElement = document.getElementById(event.id);
    console.log("  opacity:::: " + currElement.style.opacity);
    if(currElement.style.opacity == 1) {
        currElement.style.opacity = 0.5;
    }
    else {
        currElement.style.opacity = 1;
    }
}

function blankLineChart() {
    document.getElementById("cropProdIdx").checked = true
    document.getElementById("foodProdIdx").checked = false
    document.getElementById("arableLand").checked = false
    document.getElementById("agriculturalLand").checked = false
    document.getElementById("accessToElectricity").checked = false
    document.getElementById("agriMachinery").checked = false
    document.getElementById("gdp").checked = false
    document.getElementById("agriImports").checked = false
    document.getElementById("agriExports").checked = false
}

function createLineChart(lineChartData, selectedAttr) {
    // console.log("==============================");
    // console.log("entered line chart method");
    // console.log(lineChartData);
    // console.log("===============");
    // console.log(selectedAttr);

    // REFRESHING CHECKBOXES HERE
    

    if(locationIDMap[worldmap_country] == "world") {
        document.getElementById("selectedCountryName").innerHTML = locationIDMap["USA"];
    }
    else {
        document.getElementById("selectedCountryName").innerHTML = locationIDMap[worldmap_country];
    }
    
    // document.getElementById("selectedCountryName").innerHTML = "UNITED STATES OF";

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
        .attr('height', innerHeightLine)
        .attr('transform', 'translate(' + marginUpperLineChart.left + ',' + marginUpperLineChart.top + ')')



    xdata_min = d3.min(lineChartData, function(d) { return d["year"]; });
    xdata_max = d3.max(lineChartData, function(d) { return d["year"]; });
    console.log("xdata_min:" + xdata_min);
    console.log("xdata_max:" + xdata_max);

    var xScale = d3.scaleLinear().range([0, innerWidthLine]).domain([xdata_min-0.001*xdata_min, xdata_max+0.001*xdata_min])





    // FIRST PANEL 

    selectedAttr = "normalised_crop_production_index"
    cropProdIdxMax = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })
    cropProdIdxMin = d3.min(lineChartData, function(d) { return +d[selectedAttr]; })

    selectedAttr = "normalised_food_production_index"
    foodProdIdxMax = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })
    foodProdIdxMin = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })

    selectedAttr = "normalised_Arable_land_percent"
    arableLandMax = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })
    arableLandMin = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })

    selectedAttr = "normalised_agricultural_land_percent"
    agriculturalLandMax = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })
    agriculturalLandMin = d3.min(lineChartData, function(d) { return +d[selectedAttr]; })

    selectedAttr = "normalised_Access_to_electricity_rural_percent"
    accessToElectricityMax = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })
    accessToElectricityMin = d3.min(lineChartData, function(d) { return +d[selectedAttr]; })

    // agriMachinery
    selectedAttr = "normalised_agricultural_machinery_tractors_100_sqkm"
    agriMachineryMax = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })
    agriMachineryMin = d3.min(lineChartData, function(d) { return +d[selectedAttr]; })



    // FIRST PANEL 
    selectedAttr = "normalised_GDP_per_capita"
    gdpPerCapitaMax = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })
    gdpPerCapitaMin = d3.min(lineChartData, function(d) { return +d[selectedAttr]; })

    // agriImports
    selectedAttr = "normalised_Agricultural_raw_materials_imports_percent"
    agriImportsMax = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })
    agriImportsMin = d3.min(lineChartData, function(d) { return +d[selectedAttr]; })

    selectedAttr = "normalised_Agricultural_raw_materials_exports_percent"
    agriExportsMax = d3.max(lineChartData, function(d) { return +d[selectedAttr]; })
    agriExportsMin = d3.min(lineChartData, function(d) { return +d[selectedAttr]; })



    linedata_min = Math.min(cropProdIdxMin, foodProdIdxMin, arableLandMin, agriculturalLandMin, accessToElectricityMin, agriMachineryMin, gdpPerCapitaMin, agriImportsMin, agriExportsMin)
    linedata_max = Math.max(cropProdIdxMax, foodProdIdxMax, arableLandMax, agriculturalLandMax, accessToElectricityMax, agriMachineryMax, gdpPerCapitaMax, agriImportsMax, agriExportsMax)

    console.log("linedata_min:", linedata_min);
    console.log("linedata_max:", linedata_max);


    var yScale = d3.scaleLinear().range([innerHeightLine, 0]).domain([linedata_min-0.01*linedata_min, linedata_max+0.01*linedata_min])

    plotInner.append("g")
        .style("font-size", "18px")
        // .style("transform","rotate(-40)")
        .attr("transform", "translate(0," + innerHeightLine + ")")
        .attr("stroke", "white")
        .call(d3.axisBottom(xScale))
        // .selectAll("text")
        // .attr("transform","rotate(-40)")

        .append("text")
        // .attr("y", margins.bottom / 2)
        // .attr("y", marginBottomLineChart.bottom)
        .attr("y", 50)
        // .attr("x", innerWidth / 2)
        // .attr("x", innerWidthLine/2)
        .attr("x", 400)
        .attr("text-anchor", "end")
        // .attr("stroke", "white")
        .attr("fill", "white")
        .attr("font-size", "22px")
        .text("Year");

    plotInner.append("g")
        .style("font-size", "18px")
        .attr("stroke", "white")
        .call(d3.axisLeft(yScale)
        .tickFormat(function(d) {
            // return d*100 + '%';
            return d;
        }).ticks(10)
        )
        .append("text")
        .attr("transform", "rotate(-90)")
        // .attr("y", margins.left / 2 - 20)
        // marginUpperLineChart
        .attr("y", 10)
        // .attr("x", - innerHeight / 2 + 100)
        .attr("x", -50)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        // .attr("stroke", "white")
        .attr("fill", "white")
        .attr("font-size", "22px")
        // .text(selectedAttr);
        .text("Selected Attributes in %");


    plotOuter.append("text")
        // .attr("x", outerWidth/4 - margins.right)
        // .attr("x", outerWidthLine/4 - marginUpperLineChart.right)
        .attr("x", 350)
        // .attr("y", margins.top/2)
        .attr("y", 60)
        .attr("font-size", "22px")
        .attr("fill", "white")
        .text("Line Chart for attributes")
    



    selectedAttr = "normalised_crop_production_index"
    const line1 = d3.line()
        .x(d => xScale(d["year"]) + 3)
        .y(d => yScale(d["normalised_crop_production_index"]))
        .curve(d3.curveLinear)
    
    
    // selectedAttr = "food_production_index"
    selectedAttr = "normalised_food_production_index"
    const line2 = d3.line()
        .x(d => xScale(d["year"]) + 3)
        .y(d => yScale(d["normalised_food_production_index"]))
        .curve(d3.curveLinear)


    // selectedAttr = "food_production_index"
    selectedAttr = "normalised_Arable_land_percent"
    const line3 = d3.line()
        .x(d => xScale(d["year"]) + 3)
        .y(d => yScale(d["normalised_Arable_land_percent"]))
        .curve(d3.curveLinear)


    
    selectedAttr = "normalised_agricultural_land_percent"
    const line4 = d3.line()
        .x(d => xScale(d["year"]) + 3)
        .y(d => yScale(d["normalised_agricultural_land_percent"]))
        .curve(d3.curveLinear)
    
    selectedAttr = "normalised_Access_to_electricity_rural_percent"
    const line5 = d3.line()
        .x(d => xScale(d["year"]) + 3)
        .y(d => yScale(d["normalised_Access_to_electricity_rural_percent"]))
        .curve(d3.curveLinear)
    

    selectedAttr = "normalised_agricultural_machinery_tractors_100_sqkm"
    const line6 = d3.line()
        .x(d => xScale(d["year"]) + 3)
        .y(d => yScale(d["normalised_agricultural_machinery_tractors_100_sqkm"]))
        .curve(d3.curveLinear)




    selectedAttr = "normalised_GDP_per_capita"
    const line7 = d3.line()
        .x(d => xScale(d["year"]) + 3)
        .y(d => yScale(d["normalised_GDP_per_capita"]))
        .curve(d3.curveLinear)


    selectedAttr = "normalised_Agricultural_raw_materials_imports_percent"
    const line8 = d3.line()
        .x(d => xScale(d["year"]) + 3)
        .y(d => yScale(d["normalised_Agricultural_raw_materials_imports_percent"]))
    .curve(d3.curveLinear)

    selectedAttr = "normalised_Agricultural_raw_materials_exports_percent"
    const line9 = d3.line()
        .x(d => xScale(d["year"]) + 3)
        .y(d => yScale(d["normalised_Agricultural_raw_materials_exports_percent"]))
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
            const origAttr = currattr.replace("normalised_","");
            return "<strong style=\"font-size: 20px\">" + origAttr + " : </strong><span class='details' style=\"font-size: 20px\">" + displayFloat(d["dataObj"][origAttr]) + "<br></span>";
        });
    plotInner.call(circleTipLineChart);



    var color = d3.scaleOrdinal(d3.schemeSet2);



    function processObjCircleData(lineChartData, attributeName, attributeNumber, circleData, colorScale) {
        lineChartData.forEach(d => {
            let newObj = {}
            newObj["cx"] = xScale(d["year"]) + 3
            newObj["cy"] = yScale(d[attributeName])
            newObj["fill"] = colorScale(attributeNumber)
            newObj["Attribute"] = attributeName
            newObj["dataObj"] = d
            circleData.push(newObj)
        });
    }


    // Circles in line chart
    var circleData = []
    processObjCircleData(lineChartData, "normalised_crop_production_index", 0, circleData, color);
    processObjCircleData(lineChartData, "normalised_food_production_index", 1, circleData, color);
    processObjCircleData(lineChartData, "normalised_Arable_land_percent", 2, circleData, color);
    processObjCircleData(lineChartData, "normalised_agricultural_land_percent", 3, circleData, color);
    processObjCircleData(lineChartData, "normalised_Access_to_electricity_rural_percent", 4, circleData, color);
    processObjCircleData(lineChartData, "normalised_agricultural_machinery_tractors_100_sqkm", 5, circleData, color);
    processObjCircleData(lineChartData, "normalised_GDP_per_capita", 6, circleData, color);
    processObjCircleData(lineChartData, "normalised_Agricultural_raw_materials_imports_percent", 7, circleData, color);
    processObjCircleData(lineChartData, "normalised_Agricultural_raw_materials_exports_percent", 8, circleData, color);

    function onClickInteraction(d) {
        const normalAttr = d["Attribute"]
        barChartAttr = normalAttr.replace("normalised_", "");
        resetBarChart();
    }

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
            .attr("visibility", "hidden")
            .style("fill", function(d) { return d["fill"]; })
            .style('cursor', 'pointer')
            .on("mouseover", handleMouseOverCircle)
            .on("mouseout", handleMouseOutCircle)
            .on("click", onClickInteraction)



    if(document.getElementById("cropProdIdx").checked) {
        plotInner.append('path')
            // .datum(data)
            .datum(lineChartData)
            .attr('d', line1)
            .attr('fill', 'none')
            .attr('stroke', color(0))
            .attr('stroke-width', '2')
        
        document.getElementById("cropProdIdxlabel").style.opacity = 1;

        // plotInner.selectAll('.pointcrop_production_index').style("visibility", "hidden")
        plotInner.selectAll(".point_normalised_crop_production_index")
            .attr("visibility", "visible")
    }
    else {
        document.getElementById("cropProdIdxlabel").style.opacity = 0.5;
    }
    
    if(document.getElementById("foodProdIdx").checked) {
        plotInner.append('path')
            .datum(lineChartData)
            .attr('d', line2)
            .attr('fill', 'none')
            .attr('stroke', color(1))
            .attr('stroke-width', '2')

        document.getElementById("foodProdIdxLabel").style.opacity = 1;
        
        plotInner.selectAll(".point_normalised_food_production_index")
            .attr("visibility", "visible")
    }
    else {
        document.getElementById("foodProdIdxLabel").style.opacity = 0.5;
    }
    
    if(document.getElementById("arableLand").checked) {
        plotInner.append('path')
            .datum(lineChartData)
            .attr('d', line3)
            .attr('fill', 'none')
            .attr('stroke', color(2))
            .attr('stroke-width', '2')
        
        document.getElementById("arableLandLabel").style.opacity = 1;

        // agricultural_land_percent
        plotInner.selectAll(".point_normalised_Arable_land_percent")
            .attr("visibility", "visible")
    }
    else {
        document.getElementById("arableLandLabel").style.opacity = 0.5;
    }

    if(document.getElementById("agriculturalLand").checked) {
        plotInner.append('path')
            .datum(lineChartData)
            .attr('d', line4)
            .attr('fill', 'none')
            .attr('stroke', color(3))
            .attr('stroke-width', '2')
        
        document.getElementById("agriculturalLandLabel").style.opacity = 1;

        // agricultural_land_percent
        plotInner.selectAll(".point_normalised_agricultural_land_percent")
            .attr("visibility", "visible")
    }
    else {
        document.getElementById("agriculturalLandLabel").style.opacity = 0.5;
    }

    if(document.getElementById("accessToElectricity").checked) {
        plotInner.append('path')
            .datum(lineChartData)
            .attr('d', line5)
            .attr('fill', 'none')
            .attr('stroke', color(4))
            .attr('stroke-width', '2')
        
        
        document.getElementById("accessToElectricityLabel").style.opacity = 1;

        // agricultural_land_percent
        plotInner.selectAll(".point_normalised_Access_to_electricity_rural_percent")
            .attr("visibility", "visible")
    }
    else {
        document.getElementById("accessToElectricityLabel").style.opacity = 0.5;
    }

    if(document.getElementById("agriMachinery").checked) {
        plotInner.append('path')
            .datum(lineChartData)
            .attr('d', line6)
            .attr('fill', 'none')
            .attr('stroke', color(5))
            .attr('stroke-width', '2')
        
        document.getElementById("agriMachineryLabel").style.opacity = 1;

        // agricultural_land_percent
        plotInner.selectAll(".point_normalised_agricultural_machinery_tractors_100_sqkm")
            .attr("visibility", "visible")
    }
    else {
        document.getElementById("agriMachineryLabel").style.opacity = 0.5;
    }
    
    if(document.getElementById("gdp").checked) {
        plotInner.append('path')
            // .datum(data)
            .datum(lineChartData)
            .attr('d', line7)
            .attr('fill', 'none')
            .attr('stroke', color(6))
            .attr('stroke-width', '2')
        
        document.getElementById("gdpLabel").style.opacity = 1;

        // agricultural_land_percent
        plotInner.selectAll(".point_normalised_GDP_per_capita")
            .attr("visibility", "visible")
    }
    else {
        document.getElementById("gdpLabel").style.opacity = 0.5;
    }

    if(document.getElementById("agriImports").checked) {
        plotInner.append('path')
            .datum(lineChartData)
            .attr('d', line8)
            .attr('fill', 'none')
            .attr('stroke', color(7))
            .attr('stroke-width', '2')
        
        document.getElementById("agriImportsLabel").style.opacity = 1;

        // agricultural_land_percent
        plotInner.selectAll(".point_normalised_Agricultural_raw_materials_imports_percent")
            .attr("visibility", "visible")
    }
    else {
        document.getElementById("agriImportsLabel").style.opacity = 0.5;
    }

    if(document.getElementById("agriExports").checked) {
        plotInner.append('path')
            .datum(lineChartData)
            .attr('d', line9)
            .attr('fill', 'none')
            .attr('stroke', color(8))
            .attr('stroke-width', '2')
        
            document.getElementById("agriExportsLabel").style.opacity = 1;

        // agricultural_land_percent
        plotInner.selectAll(".point_normalised_Agricultural_raw_materials_exports_percent")
            .attr("visibility", "visible")
    }
    else {
        document.getElementById("agriExportsLabel").style.opacity = 0.5;
    }






    worldMapTrigger.registerListener(function(val) {
        resetLineChart()
    });

}

