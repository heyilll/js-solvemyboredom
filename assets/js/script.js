// tracks activity history
var pastactivities = [];

// to be integrated with html
$("#search-button").on("click", function(event) {
    event.preventDefault();

    var searchNum = $("#number-input :selected").text();
    var searchType = $("#type-input :selected").text().toLowerCase();
    var queryURL = "";

    if (!searchNum && !searchType) {
        queryURL = "https://www.boredapi.com/api/activity/";
    } else if (searchNum && !searchType) {
        queryURL = `https://www.boredapi.com/api/activity?participants=${searchNum}`;
    } else if (!searchNum && searchType) {
        queryURL = `https://www.boredapi.com/api/activity?type=${searchType}`;
    } else {
        queryURL = `https://www.boredapi.com/api/activity?type=${searchType}&participants=${searchNum}`;
    }

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(response => extractInfo(response));

    $("#number-input :selected").val("0");
    $("#type-input :selected").val("0");
});

$("#random-button").on("click", function(event) {
    event.preventDefault();

    var queryURL = "https://www.boredapi.com/api/activity";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(response => extractInfo(response));
});    

// extracts info about activity 
function extractInfo({activity, link, price}) {
    if (!activity) {
        activity = "No activity found with the specified parameters";
        price = "";
        link = "";
    }

    $("#activity-title").text(activity);
    $("#activity-price").text(price);
    $("#activity-link").text(link);

    console.log(activity);
    console.log(price);

    // testing for local storage
    // pastactivities.unshift(activity);
    // console.log(pastactivities);
    // localStorage.getItem(activity, JSON.stringify(link,price));

    youTubeSearch (activity);
}

// function to search for the youtube link given the text input from boredapi
function youTubeSearch (text){

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://youtube-search-results.p.rapidapi.com/youtube-search/?q="+text,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "45eb3a6e39msh58e5db491f7cc7cp104a72jsn525235543001",
            "X-RapidAPI-Host": "youtube-search-results.p.rapidapi.com"
        }
    };
    
    $.ajax(settings).done(function (response) {
        var youTube_link = response.items[0].url;
        var embeded_link = youTube_link.replace("watch?v=","embed/");

        // link to the html element to add src
        console.log(embeded_link);
        // $("#videoembed").attr("src", embeded_link);
    });
}