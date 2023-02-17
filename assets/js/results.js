var activitiesList = [];
var youtubeLinksList = [];
var AIResponsesList = [];
var actionRequired;
var historyIndex;

emptyContent();
readFromStorage();

retreiveAction();
if (actionRequired == "search") {
  createSearchContent(
    activitiesList[0],
    youtubeLinksList[0],
    AIResponsesList[0]
  );
} else if (actionRequired == "history") {
  createHistContent(historyIndex);
}

// create content from search button
function createSearchContent(act, ytLink, aiResp) {
  $("#activity-gen").append(
    $("<h2>").attr("class", "activity-title").text(act)
  );
  $("#video").attr("src", ytLink);
  displayResultsAI(aiResp, act);
}

// create content from hist btn
function createHistContent(index) {
  emptyContent();
  $("#video").attr("src", youtubeLinksList[index]);
  $("#activity-gen").append(
    $("<h2>").attr("class", "activity-title").text(activitiesList[index])
  );
  displayResultsAI(AIResponsesList[index], activitiesList[index]);
}

// function that displays the AI API response
function displayResultsAI(textInput, act) {
  if (!!textInput) {
    var textInput_Split = textInput.split("\n");

    $("#AI-response").append($("<h2>").attr("class", "ai-title").text(act));

    textInput_Split.forEach((element) =>
      $("#AI-response").append(
        $("<h3>").attr("class", "ai-content").text(element)
      )
    );
  } else {
    $("#AI-response").append($("<h2>").attr("class", "ai-title").text(act));
    $("#AI-response").append(
      $("<h3>").attr("class", "ai-content").text("No response!")
    );
  }
}

// reads in required info from local storage
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

// resets page
function emptyContent() {
  $("#video").attr("src", "");
  $("#AI-response").empty();
  $("#activity-gen").empty();
}

// gets info of button from local storage
function retreiveAction() {
  actionRequired = JSON.parse(localStorage.getItem("action-required"));
  historyIndex = JSON.parse(localStorage.getItem("hist-btn-index"));
}
