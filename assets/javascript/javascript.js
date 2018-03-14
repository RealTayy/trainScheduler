var db = firebase.database();

db.ref().on("value", function (snapshot) {
    data = snapshot.val();
    console.log(snapshot.val());
}, function (err) {
    console.log('This the error: ' + err.code);
})

var editDatabase = {
    addTrain() {
        db.ref().push({
            'name': trainName,
            'destination': destination,
            'frequency': frequency,
            'startTime': startTime
        });
    },

    deleteTrain(trainID) {
        db.ref(trainID).remove();
    },

    updateTrain(trainID, trainName, destination, frequency) {
        db.ref(trainID).set({
            'name': trainName,
            'destination': destination,
            'frequency': frequency
        })
    }
}