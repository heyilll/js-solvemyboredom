// tracks activity history
var activitiesList = [];
var youtubeLinksList = [];
var AIResponsesList = [];
var textAnswerAI = "";
var currentAct;
var currentYTLink;
var currentAIResp;

readFromStorage();
createHistButtons();

// to be integrated with html
$("#search-button").on("click", function (event) {
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
    method: "GET",
  }).then((response) => extractInfo(response));

  $("#number-input :selected").val("0");
  $("#type-input :selected").val("0");
});

$("#random-button").on("click", function (event) {
  event.preventDefault();

  var queryURL = "https://www.boredapi.com/api/activity";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then((response) => extractInfo(response));
});

// extracts info about activity
function extractInfo({ activity, link, price }) {
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

  try {
    youTubeSearch(activity);
  } catch (err) {}
  chatGPT(activity);
}

// function to search for the youtube link given the text input from boredapi
function youTubeSearch(text) {
  const settings = {
    async: true,
    crossDomain: true,
    url:
      "https://youtube-search-results.p.rapidapi.com/youtube-search/?q=" + text,
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "45eb3a6e39msh58e5db491f7cc7cp104a72jsn525235543001",
      "X-RapidAPI-Host": "youtube-search-results.p.rapidapi.com",
    },
  };

  $.ajax(settings).done(function (response) {
    var youTube_link = response.items[0].url;
    var embeded_link = youTube_link.replace("watch?v=", "embed/");
    currentYTLink = embeded_link;
  });
}

function writeToStorage(text) {
  localStorage.setItem("activity-history", JSON.stringify(text));
}

function createHistButtons() {
  $("#activity-history").empty();
  for (var i = 0; i < activitiesList.length; i++) {
    var btn = $("<button>")
      .text(activitiesList[i])
      .attr("index", i)
      .attr("class", "hist-btn");
    $("#activity-history").append(btn);
  }
}

$(document).on("click", ".hist-btn", retreiveInfo);

function retreiveInfo(){
  var index = $(this).attr("index");
  console.log(index);
}

function chatGPT(text) {
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "45eb3a6e39msh58e5db491f7cc7cp104a72jsn525235543001",
      "X-RapidAPI-Host": "you-chat-gpt.p.rapidapi.com",
    },
    body: `{"question": "${text}", "max_response_time":10}`,
  };

  // console.log(options.body);
  fetch("https://you-chat-gpt.p.rapidapi.com/TextOnly", options)
    .then((response) => response.json())
    .then((response) => {
      // console.log(response.answer);
      currentAIResp = response.answer;
      var textAnswerAI_Split = currentAIResp.split("\n");

      addToList(currentAct, currentYTLink, currentAIResp);
      writeToStorage(activitiesList, youtubeLinksList, AIResponsesList);
      displayResultsAI(textAnswerAI_Split);
      createHistButtons();
      // return response.answer;
    })
    .catch((err) => console.error(err));
}

function displayResultsAI(textInput) {
  // Get a reference to the `.wiki-search` element
  $("#display-results").empty();
  $("#display-results").append(
    $("<h2>").text("AI's Advice - " + activitiesList[0])
  );
  textInput.forEach((element) =>
    $("#display-results").append($("<h3>").text(element))
  );
}

// local storrage stuff
function readFromStorage() {
  var storedActivities = JSON.parse(localStorage.getItem("activity-history"));
  var storedYtinks = JSON.parse(localStorage.getItem("ytUrl-history"));
  var storedAIResp = JSON.parse(localStorage.getItem("AIresp-history"));
  if (storedActivities !== null) {
    activitiesList = storedActivities;
    youtubeLinksList = storedYtinks;
    AIResponsesList = storedAIResp;
    // console.log(activitiesList);
    // console.log(youtubeLinksList);
    // console.log(AIResponsesList);
  }
}

function writeToStorage(actList, ytUrlList, AIrespList) {
  localStorage.setItem("activity-history", JSON.stringify(actList));
  localStorage.setItem("ytUrl-history", JSON.stringify(ytUrlList));
  localStorage.setItem("AIresp-history", JSON.stringify(AIrespList));
}

function addToList(act, ytUrl, AIresp) {
  activitiesList.unshift(act);
  youtubeLinksList.unshift(ytUrl);
  AIResponsesList.unshift(AIresp);
  activitiesList.length = Math.min(activitiesList.length, 8);
  youtubeLinksList.length = Math.min(youtubeLinksList.length, 8);
  AIResponsesList.length = Math.min(AIResponsesList.length, 8);
}
