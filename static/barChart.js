var outerWidthBarChart = 500, outerHeightBarChart = 5/6 * outerWidthBarChart

var marginsBar = {top: 50, right: 50, bottom: 5, left: 50};

var innerWidthBarChart = outerWidthBarChart - marginsBar.left - marginsBar.right - 20
var innerHeightBarChart = outerHeightBarChart - marginsBar.top - marginsBar.bottom - 20

let plotOuterBar = d3
    .select('svg#bar')
    .attr('width', outerWidthBarChart)
    .attr('height', outerHeightBarChart)
  
let plotInnerBar = plotOuterBar
    .append('g')
    .attr('id', 'inner-plot')
    .attr('width', innerWidthBarChart)
    .attr('height', innerHeightBarChart)
    .attr('transform', 'translate(' + marginsBar.left + ',' + marginsBar.right + ')')

function setupBar(barChartData, selectedColumn) {
    // var data = data_global;
    // const selectedColumn = getSelectedColname();

    // if(categorical_vars.includes(selectedColumn)) {
    //     // hide histogram, display bar chart
    //     // document.getElementById("hist").style.visibility = "hidden";
    //     // document.getElementById("bar").style.visibility = "visible";
    //     $("#hist").hidden();
    //     $("#bar").show();
    // }
    // else {
    //     // display histogram, hide bar chart
    //     $("#hist").show();
    //     $("#bar").hide();
    // }

    // var values = data.map(d => d[xvar]);
    // const values = csv_data.map(d => d[selectedColumn]);

    // const barData = calcBar(values)
    
    xCatScale = d3
      .scaleBand()
      .domain(barChartData.map(function(d) {
        // return d.key;
        return d.country;
      }))
      .rangeRound([0, innerWidthBarChart])
      .paddingInner(0.2)
      .paddingOuter(0.1)
    //   .range([0, innerWidth])
      xCatAxis = d3.axisBottom(xCatScale)

    // set the parameters for the histogram
    ymin = d3.min(barChartData, function(d) { return d.value; });
    ymax = d3.max(barChartData, function(d) { return d.value; });
    yCatScale = d3
        .scaleLinear()
        .domain([ymin-ymax*0.08, ymax+ymax*0.08]) // get y variable from <select>
        .range([innerHeightBarChart, 0])
    yCatAxis = d3.axisLeft(yCatScale)

    plotInnerBar
    .append('g')
    .attr('transform', 'translate(' + 0 + ', ' + innerHeightBarChart + ')')
    .attr('class', 'x axis') // note: two classes; handy!
    .call(xCatAxis)

    plotInnerBar
    .append('g')
    .attr('class', 'y axis')
    .call(yCatAxis)
    
    plotOuterBar
    .append('text')
    .attr('class', 'x axis')
    .attr('x', marginsBar.left + innerWidthBarChart / 2)
    .attr('y', outerHeightBarChart - marginsBar.bottom / 2)
    .attr('text-anchor', 'middle')
    // .text(longVars[xvar])
    .text(selectedColumn)

    plotOuterBar
    .append('text')
    .attr('class', 'y axis')
    .attr('x', marginsBar.left / 2)
    .attr('y', marginsBar.bottom + innerHeightBarChart / 2)
    .attr('text-anchor', 'middle')
    .attr(
      'transform',
      `rotate(-90 ${marginsBar.left / 2} ${marginsBar.bottom + innerHeightBarChart / 2})`
    )
    .text("Frequency")

  }

function updateBar(barChartData, selectedColumn) {
    // var data = data_global;

    // const selectedColumn = getSelectedColname();
    // // var values = data.map(d => d[xvar]);
    // const values = csv_data.map(d => d[selectedColumn]);

    // // var values = data.map(d => d[xvar]);
    // // console.log(values)

    // const barData = calcBar(values);

    // // update scales
    // xCatScale.domain(barData.map(function(d) {
    //     return d.key;
    //   }));

    xCatScale = d3
      .scaleBand()
      .domain(barChartData.map(function(d) {
        // return d.key;
        return d.country;
      }))
      .rangeRound([0, innerWidthBarChart])
      .paddingInner(0.2)
      .paddingOuter(0.1)
    //   .range([0, innerWidth])
      xCatAxis = d3.axisBottom(xCatScale)

    // ymax = d3.max(barData, function(d){return d.count});
    // yCatScale.domain([0, ymax + 10])
    ymin = d3.min(barChartData, function(d) { return d.value; });
    ymax = d3.max(barChartData, function(d) { return d.value; });
    yCatScale = d3
        .scaleLinear()
        .domain([ymin-ymax*0.08, ymax+ymax*0.08]) // get y variable from <select>
        .range([innerHeightBarChart, 0])
    yCatAxis = d3.axisLeft(yCatScale)

    // update axes
    plotInnerBar
        .select('.x.axis')
        .transition()
        .duration(transitionTime)
        .call(xCatAxis)
    plotInnerBar
        .select('.y.axis')
        .transition()
        .duration(transitionTime)
        .call(yCatAxis)

 // axis labels
    plotOuterBar
        .selectAll('text.y.axis') // select text elements with two both classes
        .transition()
        .duration(transitionTime)

    plotOuterBar
        .selectAll('text.x.axis')
        .transition()
        .duration(transitionTime)
        // .text(longVars[xvar])
        .text(selectedColumn)

    // var my_group = plotInnerBar.selectAll(".chart_group")
    //                 .data(barData)
    //                 .join(function(group){
    //                     var enter = group.append("g").attr("class","chart_group");
    //                     enter.append("rect").attr("class","group_rect");
    //                     enter.append("text").attr("class","group_text");
    //                     return enter;
    //                 })
    
    var my_group = plotInnerBar.selectAll(".chart_group")
                    .data(barChartData)

                    // .join(function(group){
                    //     var enter = group.append("g").attr("class","chart_group");
                    //     enter.append("rect").attr("class","group_rect");
                    //     enter.append("text").attr("class","group_text");
                    //     return enter;
                    // })

    my_group.exit().transition()
                .duration(transitionTime).remove();

    // var enter = my_group.enter()
    //     .append("g")
    //     .attr("class", "data_group");

    var enter = my_group.enter()
        .append("g")
        .attr("class", "chart_group");

    enter.append("rect").attr("class","group_rect");
    enter.append("text").attr("class","group_text");
    my_group = my_group.merge(enter);

    my_group.select(".group_rect")
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .transition()
        .duration(transitionTime)
        .attr('x', function(d) {
                // return xCatScale(d.key);
                return xCatScale(d.country);
            })
        .attr("width", xCatScale.bandwidth())
        .attr("y", function(d) {
            // return yCatScale(d.count) + 2;
            return yCatScale(d.value) + 2;
        })
        .attr("height", function(d) {
            // return innerHeight - yCatScale(d.count);
            return innerHeightBarChart - yCatScale(d.value);
        })
        .style('fill', 'blue')
        .style('opacity', 0.6)
        
    //then position text
    my_group.select(".group_text")
        .attr("x", function(d) {
            // return xCatScale(d.key) + xCatScale.bandwidth()/2;
            return xCatScale(d.country) + xCatScale.bandwidth()/2;
        })
        .attr("y", function(d) {
                // return yCatScale(d.count + 2);
                return yCatScale(d.value + 2);
        })
        .style("visibility", "hidden")
        .attr("text-anchor","middle")
        .text(function(d) { return d.value; });
                        
    function handleMouseOver() {
        var txt = d3.select(this.nextSibling)
        txt.style('visibility','visible').style('fill', 'red')
        d3.select(this).style('fill', 'red')
        .style('opacity', 0.6)
    }

    function handleMouseOut() {
        var txt = d3.select(this.nextSibling)
        txt.style('visibility','hidden')
        d3.select(this).style('fill', 'blue')
        .style('opacity', 0.6)
    }
    
}