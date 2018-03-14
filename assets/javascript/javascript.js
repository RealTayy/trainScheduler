var db = firebase.database();

db.ref().on("value", function (snapshot) {
    data = snapshot.val();
    console.log(snapshot.val());
}, function (err) {
    console.log('This the error: ' + err.code);
})

var editDatabase = {
    addTrain(name, destination, startTime, frequency) {
        db.ref().push({
            'name': name,
            'destination': destination,
            'startTime': startTime,
            'frequency': frequency,
        });
    },

    deleteTrain(trainID) {
        db.ref(trainID).remove();
    },

    updateTrain(trainID, name, destination, startTime, frequency) {
        db.ref(trainID).set({
            'name': trainName,
            'destination': destination,
            'startTime': startTime,
            'frequency': frequency
        })
    },

    throwAlert(type, text) {
        $("#alert-message").finish();
        $("#alert-message").text(text);

        if (type === 'danger') $('#alert-message').attr({ class: 'alert alert-danger' });
        else $('#alert-message').attr({ class: 'alert alert-success' });

        $('#alert-message').animate({ opacity: 1 }, 100, function () {
            $('#alert-message').delay(2000).animate({ opacity: 0 }, 1000);
        })
    }
}

// Adds click listener for Submit Button
$('#submit').on('click', function () {
    var name = $('#nameInput').val();
    var destination = $('#destination').val();
    var startTime = $('#start-time').val();
    var frequency = $('#frequency').val();

    if (name === '') {
        editDatabase.throwAlert('danger', 'You must enter a valid name');
        return;
    }

    if (destination === '') {
        editDatabase.throwAlert('danger', 'You must enter a valid destination');
        return;
    }

    if (frequency === '') {
        editDatabase.throwAlert('danger', 'You must enter a valid frequency');
        return;
    }

    editDatabase.throwAlert('success', name + " added to the database!")
    editDatabase.addTrain(name, destination, startTime, frequency);

});

// Adds event for edit button
$(document).on('click', '.edit', function () {
    trainID = $(this).parent().parent().data('id');
    alert("Add edit functionality here for " + trainID);
})

// Adds event for delete button
$(document).on('click', '.delete', function () {
    trainID = $(this).parent().parent().data('id');
    editDatabase.deleteTrain(trainID);
})

