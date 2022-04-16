function updateChoropleth(data, attr, countries) {
    console.log(attr)
    console.log(data)
    attr = selected_attr

    maxVal = d3.max(data.features, function(d) { return +d[attr] })
    minVal = d3.min(data.features, function(d) { return +d[attr] })
    var ramp = d3.scaleSqrt().domain([minVal, maxVal]).range([lowColor, highColor])

    g.selectAll("path")
        .data(data.features)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", click)
        .style("stroke", "#FFFFFF")
        .style("stroke-width", 0.2)
        .style("fill", function(d) {
            var retVal;
            if (String(+d[attr]) === "NaN" || String(d[attr]) === "0") {
                return "black"
            }
            if (worldmap_country === "world")
                return ramp(+d[attr])

            if (d.id === worldmap_country) {
                return ramp(+d[attr])
            }


            return "gray"
        });

    if ((selected_countries.length == 0) || (selected_countries.length == maxPCPCountry)) {
        if (worldmap_country == "world") {
            for (i = 0; i < countries_path_arr.length; i++) {
                d3.select(countries_path_arr[i]).style("fill", function(p) {
                    if (String(+p[attr]) === "NaN") {
                        return "black"
                    }
                    if (String(+p[attr]) === "0") {
                        return "black"
                    }

                    return ramp(+p[attr])
                })
            }
        } else {
            d3.select(countries_path_arr[i]).style("fill", function(p) {
                if (String(+p[attr]) === "NaN") {
                    return "black"
                }
                if (String(+p[attr]) === "0") {
                    return "black"
                }
                if ((p.id === worldmap_country)) {
                    return ramp(+p[attr])
                }
                return "gray"
            })
        }

    } else if (selected_countries.length !== 0) {
        for (i = 0; i < countries_path_arr.length; i++) {
            d3.select(countries_path_arr[i]).style("fill", function(p) {
                if (String(+p[attr]) === "NaN") {
                    return "black"
                }
                if (String(+p[attr]) === "0") {
                    return "black"
                }

                if (checkCountry(p.id, selected_countries) || (p.id === worldmap_country)) {
                    return ramp(+p[attr])
                }
                return "gray"
            })
        }
    }


    let div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    function mouseover(d) {
        if (String(+d[attr]) === "NaN")
            return
        if (String(+d[attr]) === "0")
            return

        tip.show(d);

        d3.select(this)
            .style("opacity", 1)
            .style("stroke", "white")
            .style("stroke-width", 1);
    }

    function mouseout(d) {
        div.transition()
            .duration('200')
            .style("opacity", 0);

        d3.select(this).style("stroke-width", 0.2)
        tip.hide(d)
    }

    function click(d) {
        if (String(+d[attr]) !== "0") {
            clicked_ptr.push({ ptr: this, color: ramp(+d[attr]) })
            clicked_countries.push(d.id)

            worldmap_country = d.id;

            worldMapTrigger.a = d.id


            var lineTitle = document.getElementById("lineTitle").innerHTML.split(" ")

            lineTitle[1] = selected_attr
            lineTitle[6] = selected_start_date
            lineTitle[8] = selected_end_date

            document.getElementById("lineTitle").innerHTML = "Average daily " + selected_attr + " of " + locationIDMap[worldmap_country] + " between " + selected_start_date + " to " + selected_end_date;


            for (i = 0; i < countries_path_arr.length; i++) {
                d3.select(countries_path_arr[i]).style("fill", function(p) {
                    if (String(+p[attr]) === "NaN" || String(+p[attr]) === "0") {
                        return "black"
                    }
                    if (p.id === d.id) return ramp(+p[attr])

                    if (selected_countries.length !== maxPCPCountry) {
                        if (checkCountry(p.id, selected_countries)) return ramp(+p[attr])
                    }
                    return "gray"
                })
            }

        }

        if (String(+d[attr]) !== "NaN") {
            clicked_ptr.push({ ptr: this, color: ramp(+d[attr]) })
            clicked_countries.push(d.id)

            worldmap_country = d.id;

            worldMapTrigger.a = d.id

            for (i = 0; i < countries_path_arr.length; i++) {
                d3.select(countries_path_arr[i]).style("fill", function(p) {
                    if (String(+p[attr]) === "NaN" || String(+p[attr]) === "0") {
                        return "black"
                    }
                    if (p.id === d.id) return ramp(+p[attr])
                    if (selected_countries.length !== maxPCPCountry) {
                        if (checkCountry(p.id, selected_countries)) return ramp(+p[attr])
                    }
                    return "gray"
                })
            }
        }


        if (String(+d[attr]) === "NaN") {
            worldmap_country = "world"
            worldMapTrigger.a = "world"

            for (i = 0; i < countries_path_arr.length; i++) {
                d3.select(countries_path_arr[i])
                    .style("opacity", 1)
                    .style("stroke", "white")
                    .style("stroke-width", 0.2)
                    .style("fill", function(p) {
                        if (String(+p[attr]) === "NaN" || String(+p[attr]) === "0") {
                            return "black"
                        }
                        return ramp(+p[attr])
                    })
            }
        }

        if (String(+d[attr]) === "0") {
            worldmap_country = "world"
            worldMapTrigger.a = "world"

            for (i = 0; i < countries_path_arr.length; i++) {
                d3.select(countries_path_arr[i])
                    .style("opacity", 1)
                    .style("stroke", "white")
                    .style("stroke-width", 0.2)
                    .style("fill", function(p) {
                        if (String(+p[attr]) === "NaN" || String(+p[attr]) === "0") {
                            return "black"
                        }
                        return ramp(+p[attr])
                    })
            }
        }
        tip.hide()
    }

    var y = d3.scaleLinear()
        .range([h, 0])
        .domain([minVal, maxVal]);

    var yAxis = d3.axisRight(y).tickFormat(function(d) {
        if (d >= 100000)
            return (d / 1000000).toFixed(2) + 'M';
        else return d;
    });

    key.selectAll("g.y-axis")
        .transition().duration(100).call(yAxis);

    d3.selectAll(".y-axis text")
        .style("fill", "rgb(155, 155, 155)");

}




// ********************************************************** //

var lowColor = 'rgb(250, 197, 173)'
var highColor = 'rgb(85, 28, 1)'
var selected_countries = []
var selected_attr = "new_cases"
var selected_start_date = "2020-01-23"
var selected_end_date = "2021-04-17"

dates = {}
dates.start = selected_start_date
dates.end = selected_end_date

$(document).ready(function() {
    $.ajax({
        type: "POST",
        url: "/worldmap",
        contentType: "application/json",
        data: JSON.stringify(dates),
        dataType: "json",
        success: function(response) {
            worldData = (response)

            updateChoropleth(worldData, selected_attr, selected_countries)
        },
        error: function(err) {
            console.log(err);
        }
    });
});

