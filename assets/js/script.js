// tracks activity history
var activitiesList = [];
var youtubeLinksList = [];
var AIResponsesList = [];
var textAnswerAI = "";
var currentAct;
var currentYTLink;
var currentAIResp;
var ytReady = 0;
var AIReady = 0;

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

  window.location.replace("./main.html");

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

  window.location.replace("./main.html");
});

// extracts info about activity
function extractInfo({ activity, link, price }) {
  if (!activity) {
    activity = "No activity found with the specified parameters";
    price = "Not found";
    link = "Not found";
  }

  // $("#activity-title").text(activity);
  // $("#activity-price").text(price);
  // $("#activity-link").text(link);

  console.log(activity);
  // console.log(price);

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
    console.log(currentYTLink);
    ytReady = 1;
  });
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
  console.log("hist btns created");
}

$(document).on("click", ".hist-btn", retreiveInfo);

function retreiveInfo() {
  var index = $(this).attr("index");
  window.location.replace("./main.html");
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
      console.log(response.answer);
      currentAIResp = response.answer;
      AIReady = 1;
    })
    .catch((err) => {
      console.error(err);
      currentAIResp = "Even AI's can run into errors";
    });
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

setInterval(function () {
  if (ytReady == 1 && AIReady == 1) {
    addToList(currentAct, currentYTLink, currentAIResp);
    writeToStorage(activitiesList, youtubeLinksList, AIResponsesList);
    ytReady = 0;
    AIReady = 0;
  }
}, 1000);

function pickColor() {
          
  // Array containing colors
  var colors = [
      '#ff0000', '#00ff00', '#0000ff',
      '#ff3333', '#ffff00', '#ff6600'
  ];
    
  // selecting random color
  var random_color = colors[Math.floor(Math.random() * colors.length)];
    
  return random_color;
}
