function resetDashboard(){
    console.log("reset")
    // $("#covidattr").val("new_cases")
    $("#covidattr").val("crop_production_idx")
    $("#covidattr").change()
    pcp_countries = ["United States of America", "India"]
    worldmap_country = "world";

    // selected_attr = "new_cases"
    selected_attr = "crop_production_idx"
    selected_start_date = "2020-01-23"
    selected_end_date = "2021-04-17"
    selected_countries = []
    avg_cases = 0
    avg_deaths = 0
    avg_vaccinations = 0
    statData = ""

    currLine = "none"

    $.ajax({
        type: "GET",
        url: "/worldmap",
        success: function(response) {
            worldData = response

            createChoropleth(worldData, selected_attr)
        },
        error: function(err) {
            console.log(err);
        }
    });
}


$(document).ready( function() {

    $('#resetAll').click(resetDashboard);
    
});
