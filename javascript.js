// Initialize Firebase
var config = {
    apiKey: "AIzaSyAT3_s6FsIhpclqnPEvBHYHvKct_ehR8Gw",
    authDomain: "train-scheduler-30fae.firebaseapp.com",
    databaseURL: "https://train-scheduler-30fae.firebaseio.com",
    projectId: "train-scheduler-30fae",
    storageBucket: "",
    messagingSenderId: "522784872689"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var trainStart = moment($("#start-input").val().trim(), "HH:mm").format("X");
    var trainFreq = $("#freq-input").val().trim();

    var newTrain = {
        name: trainName,
        destination: trainDest,
        start: trainStart,
        frequency: trainFreq
    };

    // Uploads train data to the database
    database.ref().push(newTrain);
    // for test only
    console.log(newTrain);

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#freq-input").val("");
});

// Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().start;
    var trainFreq = childSnapshot.val().frequency;

    var startTimeConverted = moment(trainStart, "HH:mm");
    console.log("START TIME: " + moment(startTimeConverted).format("HH:mm"));

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(startTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainFreq;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainFreq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(nextTrain),
        $("<td>").text(tMinutesTillTrain),
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});