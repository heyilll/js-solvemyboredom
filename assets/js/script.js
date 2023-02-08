// testing section
// var choice = "";
// var custom = "participants=3"

// var queryURL = "https://www.boredapi.com/api/activity?" + custom;

// $.ajax({
//     url: queryURL,
//     method: "GET"
// }).then(response => extractInfo(response));

// to be integrated with html
$("#search-button").on("click", function(event) {
    event.preventDefault();

    var search = $("#search-input").val().trim();
    if (search == "") {
        return;
    }

    if (!search) {
        choice = "/";
    } else {
        choice = "?";
    }

    queryURL = "https://www.boredapi.com/api/activity" + choice + search;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(response => extractInfo(response));
});

// extracts info about activity 
function extractInfo({activity, link, price}) {
    console.log(activity);
    console.log(link);
    console.log(price);
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
        // console.log(response);
        // console.log(response.items[0].url);
        var youTube_link = response.items[0].url;
        var embeded_link = youTube_link.replace("watch?v=","embed/");
        
        // console.log(embeded_link);
            
    });
}