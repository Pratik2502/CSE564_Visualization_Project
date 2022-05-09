var all_countries = []

var pcp_countries = ["United States of America", "India"]
var worldmap_country = "world";
var agriDataFeatures = []

// var selected_attr = "new_cases"
var selected_attr = "crop_production_idx"
var selected_start_date = "2020-01-23"
var selected_end_date = "2021-04-17"
var selected_countries = []
var avg_cases = 0
var avg_deaths = 0
var avg_vaccinations = 0
var statData = ""

var currLine = "none"

var maxPCPCountry = 0;

var locationIDMap = { "world": "World" }

$.ajax({
    type: "GET",
    url: "/worldmap",
    success: function(response) {
        worldData = response
        for (var i in worldData.features)
            all_countries.push(worldData.features[i].properties.name);

        worldData.features.forEach(element => {
            locationIDMap[element["id"]] = element.properties.name
            // agriDataFeatures.add(element)
        });
        createChoropleth(worldData, selected_attr)
    },
    error: function(err) {
        console.log(err);
    }
});


function resetLineChart() {
    console.log("!!!!!! inside reset !!!!!")
    ddVal = { "country": worldmap_country }
    reqDataSent = JSON.stringify(ddVal);
    console.log(reqDataSent);
    $.ajax({
        // type: "GET",
        type: "POST",
        url: "/agriLineChart",
        contentType: "application/json",
        data: reqDataSent,
        dataType: "json",
        success: function(response) {
            console.log(" ============ Ajax success ===========");
            console.log(response);
            lineChartData = response;
            // lineChartData = JSON.parse(response)
            // for (var i in lineChartData.features)
            //     all_countries.push(lineChartData.features[i].properties.name);
    
            // worldData.features.forEach(element => {
            //     locationIDMap[element["id"]] = element.properties.name
            // });
    
            // createLineChart(lineChartData["agriLineData"], selected_attr)
            createLineChart(lineChartData["agriLineData"], "Crop production index (2004-2006 = 100)")
        },
        error: function(err) {
            console.log(err);
        }
    });
    
}
resetLineChart()
