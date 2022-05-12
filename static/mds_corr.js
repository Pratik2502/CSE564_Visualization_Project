var outerWidthMDScorr = 500, outerHeightMDScorr = 5/6 * outerWidthMDScorr

var marginsmds = {top: 50, right: 50, bottom: 5, left: 50};

var innerWidthMDScorr = outerWidthMDScorr - marginsmds.left - marginsmds.right - 20
var innerHeightMDScorr = outerHeightMDScorr - marginsmds.top - marginsmds.bottom - 20

function plot_mds_corr(mds_corr_data, mds_corr_values) {
    d3.select("#mdsCORRplot").html("")
    var plotOutercorr = d3.select("#mdsCORRplot").append("svg")
                    .attr("width", outerWidthMDScorr)
                    .attr("height", outerHeightMDScorr)
                    .attr("style", "outline: thin solid black;") 

                    
    plotInnercorr = plotOutercorr
                    .append('g')
                    .attr('id', 'inner-plot')
                    .attr('width', innerWidthMDScorr)
                    .attr('height', innerHeightMDScorr)
                    .attr('transform', 'translate(' + marginsmds.left + ',' + marginsmds.top + ')')


    var xScale = d3.scaleLinear().range ([0, innerWidthMDScorr]),
        yScale = d3.scaleLinear().range ([innerHeightMDScorr, 0]);
    
    var color = d3.scaleOrdinal(d3.schemeSet2);

    xScale.domain([d3.min(mds_corr_data, function(d){ return d.x }), d3.max(mds_corr_data, function(d){ return d.x })]);
    yScale.domain([d3.min(mds_corr_data, function(d){ return d.y }), d3.max(mds_corr_data, function(d){ return d.y })]);

    plotOutercorr.append("text")
        .attr("x", outerWidthMDScorr/2 - marginsmds.right - 180)
        .attr("y", marginsmds.top/2)
        .attr("fill", "white")
        .attr("font-size", "24px")
        .text("Attributes MDS Plot using Correlation")

    // mds_corr_data.forEach(function(p1, i1) {
    //     mds_corr_data.forEach(function(p2, i2) {
    //         if (i1 !== i2) {
    //             plotInnercorr.append("line")
    //                 .attr('class', "line " + p1.fields + "-" + p2.fields + " " + p2.fields + "-" + p1.fields)
    //                 .attr('x1', xScale(p1.x))
    //                 .attr('y1', yScale(p1.y))
    //                 .attr('x2', xScale(p2.x))
    //                 .attr('y2', yScale(p2.y))
    //                 .style('stroke', 'lightgrey')
    //                 .style("visibility", "hidden")
    //         }
    //     });
    // });



    function getCoordinatesForAttr(attrName, mds_corr_data) {
        coords = {}
        coordObj = mds_corr_data.filter(objs => objs["fields"] == attrName);
        // console.log("          !!!!!!!!!!!   p1   !!!!!!!!!!             ");
        // console.log(coordObj);
        if(coordObj == undefined || coordObj == null)
            return null;
        coords["x"] = coordObj[0]["x"];
        coords["y"] = coordObj[0]["y"];
        return coords
    }




    const lowColorPos = 'rgb(222, 235, 247)'
    const highColorPos = 'rgb(8, 48, 107)'

    let minValPosCorr = d3.min(mds_corr_values.filter(d => d["value"] >= 0), function(d) { return d["value"] });
    let maxValPosCorr = d3.max(mds_corr_values.filter(d => d["value"] >= 0), function(d) { return d["value"] });
    
    var rampPos = d3.scaleSqrt().domain([minValPosCorr, maxValPosCorr]).range([lowColorPos, highColorPos])

    const highColorNeg = 'rgb(249 33 69)'
    const lowColorNeg = 'rgb(253 188 199)'
    
    let minValNegCorr = d3.min(mds_corr_values.filter(d => d["value"] < 0), function(d) { return d["value"] });
    let maxValNegCorr = d3.max(mds_corr_values.filter(d => d["value"] < 0), function(d) { return d["value"] });
    
    var rampNeg = d3.scaleSqrt().domain([minValNegCorr, maxValNegCorr]).range([lowColorNeg, highColorNeg])


    mds_corr_values.forEach(function(obj) {
        
        
        console.log(obj);
        let p1 = getCoordinatesForAttr(obj["field1"], mds_corr_data)
        let p2 = getCoordinatesForAttr(obj["field2"], mds_corr_data)


        if(typeof p1 === 'object' && p1 !== null && "x" in p1 && "y" in p1 && p1["x"] != undefined && p1["y"] != undefined) {
            if(typeof p2 === 'object' && p2 !== null && "x" in p2 && "y" in p2  && p2["x"] != undefined  && p2["y"] != undefined) {
                plotInnercorr.append("line")
                    // .attr('class', "line " + p1.fields + "-" + p2.fields + " " + p2.fields + "-" + p1.fields)
                    .attr('class', "line " + obj["field1"] + "-" + obj["field2"] + " " + obj["field2"] + "-" + obj["field1"])
                    .attr('x1', xScale(p1.x))
                    .attr('y1', yScale(p1.y))
                    .attr('x2', xScale(p2.x))
                    .attr('y2', yScale(p2.y))
                    .style('stroke-width', 1.5)
                    // .style('stroke', 'lightgrey')
                    .style('stroke', function(d) {
                        if(obj["value"] >= 0) {
                            return rampPos(obj["value"]);
                        }
                        return rampNeg(obj["value"]);
                    })
                    // .style('fill', 'red')
                    .style("visibility", "visible")
            }
        }

        
    });

    var pcp_axis_order = []
    var top=-1;

    function handleClick(d, i){
        console.log("++++++++ handling click ++++++++");
        console.log(d);
        console.log(i);
        barChartAttr = d.fields;
        resetBarChart();
        // var curr = d3.select(this)
        // curr.style("fill", "red")
        //     .attr('r', 8)

        // var check = 0;
        // for(i=0; i<pcp_axis_order.length - 1; i++){
        //     if(pcp_axis_order[i] === d.fields){
        //         check = 1;
        //     }
        // }
        // if(top != -1 && !check){
        //     d3.selectAll("." + pcp_axis_order[top] + '-' + d.fields).style("stroke", "blue").style("visibility", "visible")
        //     d3.selectAll("." + d.fields + '-' + pcp_axis_order[top]).style("stroke", "blue").style("visibility", "visible")
        // }

        // var circle = plotInnercorr.selectAll(".point")
        // var flag =0;
        // var index = -1;
        // for(i=0; i<pcp_axis_order.length; i++){
        //     if(pcp_axis_order[i] === d.fields){
        //         flag=1;
        //         index = i;
        //         if(i === top){
        //             pcp_axis_order.pop()
        //             top--;
        //             curr.style("fill", function(d) { return color(d.x); })
        //             if(top != -1){
        //                 d3.selectAll("." + pcp_axis_order[top] + '-' + d.fields).style("stroke", "blue").style("visibility", "hidden")
        //                 d3.selectAll("." + d.fields + '-' + pcp_axis_order[top]).style("stroke", "blue").style("visibility", "hidden")
        //             }
        //         }
        //     }
        // }
        // if(!flag){
        //     pcp_axis_order.push(d.fields)
        //     top++;
        // }
        // if(pcp_axis_order.length == 10){
        //     $.ajax({
        //         type: "GET",
        //         url: "/pcp",
        //         success: function(response) {
        //             pcp_data = JSON.parse(response);
        //             plot_pcp(pcp_data, pcp_axis_order)
        //             pcp_axis_order = []
        //             circle.style("fill", function(d) { return color(d.x); })
        //                  .attr("r", 8)
        //             mds_corr_data.forEach(function(p1, i1) {
        //                 mds_corr_data.forEach(function(p2, i2) {
        //                     if (i1 !== i2) {
        //                         d3.selectAll("." + p1.fields + "-" + p2.fields)
        //                             .style("stroke", "lightgrey")
        //                             .style("visibility", "hidden")
        //                     }
        //                 });
        //             });
        //             top=-1;
        //         },
        //         error: function(err) {
        //             console.log(err);
        //         }
        //     });
        // }
    }

    // function checkVisited(label){
    //     for(i=0; i<pcp_axis_order.length; i++){
    //         if(label === pcp_axis_order[i]){
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    function handleMouseOver(d, i){
        // mds_corr_data.forEach(function(p, j) {
        //     if (i !== j && !checkVisited(p.fields)) {
        //         d3.selectAll("." + p.fields + '-' + d.fields).style("visibility", "visible")
        //         d3.selectAll("." + d.fields + '-' + p.fields).style("visibility", "visible")
        //     }
        // });
    }

    function handleMouseOut(d, i){
        // mds_corr_data.forEach(function(p, j) {
        //     if (i !== j && !checkVisited(p.fields) ) {
        //         d3.selectAll("." + p.fields + '-' + d.fields).style("visibility", "hidden")
        //         d3.selectAll("." + d.fields + '-' + p.fields).style("visibility", "hidden")
        //     }
        // });
    }

    var points = plotInnercorr.selectAll("circles")
            .data(mds_corr_data)
            .enter()
            .append("circle")
            .attr("class", "point")
            .attr("cx", function(d) { return xScale(d.x); })
            .attr("cy", function(d) { return yScale(d.y); })
            .attr("r", 8)
            .attr("fill", "blue")
            .style("fill", function(d) { return color(d.x); })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("click", handleClick)

    plotInnercorr.selectAll("circles")
            .data(mds_corr_data)
            .enter()
            .append("text")
            .text(function(d){ return d.short_names; })
            .attr("x", function(d) { return xScale(d.x); })
            .attr("y", function(d) { return yScale(d.y); })
            .style("font-weight", "bold")
}