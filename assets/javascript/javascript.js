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
            'name': name,
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

var displayTrains = {
    displayMain(trainDatabase) {        
        $("#train-table").find('tbody').remove();
        for (var key in trainDatabase) {
            data = trainDatabase[key];
            var newTbody = $('<tbody>');
            var newTr = $('<tr>').attr({ id: key, 'data-id': key });
            var nameTh = $('<th>').attr({ scope: 'row', class: 'name' }).text(data.name);
            var destinationTh = $('<th>').attr({ class: 'destination' }).text(data.destination);
            var frequencyTh = $('<th>').attr({ class: 'frequency' }).text(data.frequency);

            // TO DO: REPLACE "12:00PM" WITH A METHOD THAT RETURNS NEXT ARRIVAL!
            var arrivalTh = $('<th>').attr({ class: 'arrival' }).text('12:00PM');

            // TO DO: REPLACE "5" WITH A WAY TO METHOD THAT RETURNS MINUTES AWAY!
            var minutesawayTh = $('<th>').attr({ class: 'minutes-away' }).text(5);

            // These lines create the two buttons under "Actions"
            var actionTh = $('<th>').attr({ scope: 'col' })
            var editSpan = $('<span>').attr({ class: 'action edit' });
            var editIcon = $('<i>').attr({ class: 'fas fa-edit' });
            var deleteSpan = $('<span>').attr({ class: 'action delete' });
            var deleteIcon = $('<i>').attr({ class: 'fas fa-times-circle' });
            actionTh.append(editSpan.append(editIcon), deleteSpan.append(deleteIcon));

            newTr.append(nameTh, destinationTh, frequencyTh, arrivalTh, minutesawayTh, actionTh);
            newTbody.append(newTr);
            $('#train-table').append(newTbody);
        }
    }
}

var db = firebase.database();

// Does this on page load and when a new train is added
db.ref().on('value', function (snapshot) {
    console.log("hi")
    data = snapshot.val();
    displayTrains.displayMain(data);
}, function (err) {
    console.log('This the error: ' + err.code);
})

// Does this when a child is edited
db.ref().on('child_changed', function (snapshot) {
    console.log("hehe")
    data = snapshot.val();
    console.log(data);
}, function (err) {
    console.log('This the error: ' + err.code);
})

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

