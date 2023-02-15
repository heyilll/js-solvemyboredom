var activitiesList = [];
var youtubeLinksList = [];
var AIResponsesList = [];

emptyContent();
readFromStorage();

// create content from search button
function createSearchContent(act, ytLink, aiResp) {
  $(".activity-gen").append(
    $("<h2>").attr("class", "activity-title").text(act)
  );
  $("#video").attr("src", ytLink);
  displayResultsAI(aiResp);
}

// create content from hist btn
function createHistContent(index) {
  emptyContent();
  $("#video").attr("src", youtubeLinksList[index]);
  $("#activity-gen").append(
    $("<h2>").attr("class", "activity-title").text(activitiesList[index])
  );
  displayResultsAI(AIResponsesList[index], activitiesList[index]);
  console.log("hist content created");
}

function displayResultsAI(textInput, act) {
  if (textInput == "") {
    return;
  }
  var textInput_Split = textInput.split("\n");
  $("#AI-Response").append(
    $("<h2>")
      .attr("class", "ai-title")
      .text(`AI's Advice - ` + act)
  );

  textInput_Split.forEach((element) =>
    $("#AI-Response").append(
      $("<h3>").attr("class", "ai-content").text(element)
    )
  );
  console.log("ai results displayed");
}

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

function emptyContent() {
  $("#video").attr("src", "");
  $("#AI-response").empty();
  $("#activity-gen").empty();
  console.log("content empty");
}
