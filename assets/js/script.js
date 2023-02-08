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