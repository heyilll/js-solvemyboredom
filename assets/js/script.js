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

// search button event listener
$("#search-button").on("click", function (event) {
  event.preventDefault();

  // gets user parameters from input fields
  var searchNum = $("#participants").find("option:selected").text();
  var searchType = $("#activity").find("option:selected").text().toLowerCase();
  var queryURL = "";

  // loading animation
  let loader = `<div class="loader"></div>`;
  document.getElementById('search-area').innerHTML = "";
  document.getElementById('search-area').innerHTML = loader;

  // checks if required info is ready 
  setInterval(function () {
    if (ytReady == 1 && AIReady == 1) {
      addToList(currentAct, currentYTLink, currentAIResp);
      writeToStorage(activitiesList, youtubeLinksList, AIResponsesList);
      ytReady = 0;
      AIReady = 0;
      window.location.replace("./main.html");
    }
  }, 1000);

  if (!searchNum && !searchType) {
    queryURL = "https://www.boredapi.com/api/activity/";
  } else if (searchNum && !searchType) {
    queryURL = `https://www.boredapi.com/api/activity?participants=${searchNum}`;
  } else if (!searchNum && searchType) {
    queryURL = `https://www.boredapi.com/api/activity?type=${searchType}`;
  } else {
    queryURL = `https://www.boredapi.com/api/activity?type=${searchType}&participants=${searchNum}`;
    
  }

  // API call
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then((response) => extractInfo(response));

  $("#number-input :selected").val("0");
  $("#type-input :selected").val("0");
});

// random button event listener
$("#random-button").on("click", function (event) {
  event.preventDefault();

  // loading animation
  let loader = `<div class="loader"></div>`;
  document.getElementById('search-area').innerHTML = "";
  document.getElementById('search-area').innerHTML = loader;

  // checks if required info is ready 
  setInterval(function () {
    if (ytReady == 1 && AIReady == 1) {
      addToList(currentAct, currentYTLink, currentAIResp);
      writeToStorage(activitiesList, youtubeLinksList, AIResponsesList);
      ytReady = 0;
      AIReady = 0;
      window.location.replace("./main.html");
    }
  }, 1000);

  var queryURL = "https://www.boredapi.com/api/activity";

  // API call
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then((response) => extractInfo(response));

});

// extracts info about activity
function extractInfo({ activity, link, price }) {
  if (!activity) {
    activity = "No activity found with the specified parameters";
    price = "Not found";
    link = "Not found";
    currentAct = activity;
    localStorage.setItem("action-required", JSON.stringify("search"));
    currentYTLink = "https://www.youtube.com/embed/y96e9_DMKzE";
    ytReady=1;
    currentAIResp = "Please search again choosing different parameters!";
    AIReady = 1;
  }
  else{
  currentAct = activity;
  localStorage.setItem("action-required", JSON.stringify("search"));

  try {
    youTubeSearch(activity);
  } catch (err) {}
  chatGPT(activity);
}
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
      "X-RapidAPI-Key": "2ae5dcbf0fmsh382aef7be3f7304p1c4366jsn4f2ac730d889",
      "X-RapidAPI-Host": "youtube-search-results.p.rapidapi.com",
    },
  };

  // API call
  $.ajax(settings).done(function (response) {
    var youTube_link = response.items[0].url;
    var embeded_link = youTube_link.replace("watch?v=", "embed/");
    currentYTLink = embeded_link;
    ytReady = 1;
  });
}

// dynamically creates history buttons
function createHistButtons() {
  $("#activity-history").empty();
  for (var i = 0; i < activitiesList.length; i++) {
    if(activitiesList[i] && !(activitiesList[i].includes("No activity found",0))) {
      var btn = $("<button>")
        .text(activitiesList[i])
        .attr("index", i)
        .attr("class", "hist-btn")
        .css('background-color', pickColor());  
      $("#activity-history").append(btn);
    }
  }
}

// history button event listener
$(document).on("click", ".hist-btn", retreiveInfo);

// retrieves info from the specific clicked history button
function retreiveInfo() {
  var index = $(this).attr("index");
  localStorage.setItem("action-required", JSON.stringify("history"));
  localStorage.setItem("hist-btn-index", JSON.stringify(index));
  window.location.replace("./main.html");
  console.log(index);
}

// Handles ChatGPT API calls
function chatGPT(text) {
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "0f8ad57aa3msh3c81fb85dcfdad1p142227jsn3c3ddc23474f",
      "X-RapidAPI-Host": "you-chat-gpt.p.rapidapi.com",
    },
    body: `{"question": "How to ${text} in four sentences?", "max_response_time":10}`,
  };

  // API call
  fetch("https://you-chat-gpt.p.rapidapi.com/TextOnly", options)
    .then((response) => response.json())
    .then((response) => {
      currentAIResp = response.answer;
      AIReady = 1;
    })
    .catch((err) => {
      console.error(err);
      currentAIResp = "Even AIs can run into errors";
    });
}

// read and write local storage functions
function readFromStorage() {
  var storedActivities = JSON.parse(localStorage.getItem("activity-history"));
  var storedYtinks = JSON.parse(localStorage.getItem("ytUrl-history"));
  var storedAIResp = JSON.parse(localStorage.getItem("AIresp-history"));
  if (storedActivities !== null) {
    activitiesList = storedActivities;
    youtubeLinksList = storedYtinks;
    AIResponsesList = storedAIResp;
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

// function that chooses a random color from an array of colors
function pickColor() {
  var colors = [
      'rgba(100,198,199,255)',
      'rgba(249,150,32,255)', 'rgba(239,102,150,255)',
      'rgba(244,206,34,255)', 'rgba(239,54,69,255)',
      'rgba(114,187,161,255)','rgb(181,114,114)','rgb(30,129,176)',
      'rgb(234,182,118)','#8BF18B','#9B6EF3'
  ];
    
    
  // selecting random color

  // selecting random color
  var random_color = colors[Math.floor(Math.random() * colors.length)];
    
  return random_color;
}
