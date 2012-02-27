$(document).ready(function() {
   $("#page1").show();

    $(".categories li").click(function() {
        $(".categories li").removeClass("active");
        $(this).addClass("active");
    });

    $(".next").click(function() {
        var $par = $(this).parents(".page");
        $par.hide().next().show();
    });

    $("#page2 #find-near").click(function() {
        $("#stop-finder").show();
    });

    $("#find-near").click(function() {
        //var url = "http://api.onebusaway.org/api/where/schedule-for-stop/1_" + $("#stopid").attr('value') + ".json?key=TEST";
        var url = "http://api.onebusaway.org/api/where/stops-for-location.json";

        var data = {
             key: "TEST",
             lat: $.latitude,
             lon: $.longitude,
             radius: 300
        };



        $.ajax({
            url: url,
            data: data,
            dataType: "jsonp",
            success: function(result) {
                                 console.log(result);
                // sort the stops
                result.data.stops.sort(sortStops);
                $.each(result.data.stops, function(key, value) {

                    var distance = stopDistance(value);

                    var $li = $("<li>")
                        .text(distance + " miles ( " + value.routes.length + " routes ) - "  + wordToUpper(value.name))
                        .css("color", "black")
                        .css("list-style", "none")
                        .click(function() {
                            var $ul = $("<ul/>");
                            $.each(value.routes, function(index, stopRoutes){
                                $ul.append(
                                    $("<li/>").text(wordToUpper(stopRoutes.shortName))
                                );
                            });
                            $li.append($ul);
                        });
                    $("#stops-near").append(
                          $li
                    );
                });
            }
        });
    });
});

var submitModel = {
    category: null,
    stopID: null,
    stopLat: null,
    stopLon: null,
    routeID: null,
    description: null
};


/**
 * Rewrites "A SENTENCE SUCH as this one" into "A Sentence Such As This One"
 * @param strSentence
 * @returns A properly capitalized sentence.
 */
function wordToUpper(strSentence) {
    strSentence = strSentence.toLowerCase().replace(/\b[a-z]/g, convertToUpper);
    strSentence = strSentence
        .replace("Ne ", "NE ")
        .replace("Se ", "SE ")
        .replace("Nw ", "NW ")
        .replace("Sw ", "SW ")
        .replace(" Ne", " NE")
        .replace(" Se", " SE")
        .replace(" Nw", " NW")
        .replace(" Sw", " SW");
    return strSentence;
    function convertToUpper() {
        if (arguments == "NE")
            return arguments;
        return arguments[0].toUpperCase();
    }
}

/**
 * Compares two stops based on distance from user
 * and number of routes which stop there.
 * @param stopA
 * @param stopB
 * @returns The difference in distance and number of routes between two stops.
 */
function sortStops(stopA, stopB) {
    // assume that the difference in distances will be ~0.05 miles
    var distDiff = 120 * (stopDistance(stopA) - stopDistance(stopB));

    // assume that the number of routes at a stop will vary between 1 and 10
    var routeDiff = stopB.routes.length - stopA.routes.length;

    return distDiff + routeDiff;
}


/**
 * Calculates the distance from the current user to the specified stop.
 * @param stop
 * @returns Distance the stop is from the user.
 */
function stopDistance(stop) {
    return Math.round(
        distanceBetween(
            $.latitude,
            $.longitude,
            stop.lat,
            stop.lon
        ) * 100 ) / 100;
}