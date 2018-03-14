var editDatabase = {
    addTrain(name, destination, startTime, frequency) {
        db.ref().push({
            'name': name,
            'destination': destination,
            'startTime': startTime,
            'frequency': frequency,
        });
    },

    deleteTrain(key) {
        db.ref(key).remove();
    },

    updateTrain(key, name, destination, startTime, frequency) {
        db.ref(key).set({
            'name': name,
            'destination': destination,
            'startTime': startTime,
            'frequency': frequency
        })
    },

    throwMainAlert(type, text) {
        $("#alert-message").finish();
        $("#alert-message").text(text);

        if (type === 'danger') $('#alert-message').attr({ class: 'alert alert-danger' });
        else $('#alert-message').attr({ class: 'alert alert-success' });

        $('#alert-message').animate({ opacity: 1 }, 100, function () {
            $('#alert-message').delay(2000).animate({ opacity: 0 }, 1000);
        })
    },

    throwEditAlert(type, text) {
        $("#edit-alert").finish();
        $("#edit-alert").text(text);

        if (type === 'danger') $('#edit-alert').attr({ class: 'alert alert-danger col' });
        else $('#edit-alert').attr({ class: 'alert alert-success col' });

        $('#edit-alert').animate({ opacity: 1 }, 100, function () {
            $('#edit-alert').delay(2000).animate({ opacity: 0 }, 1000);
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
            var actionTh = $('<th>').attr({ class: 'action-group', scope: 'col' })
            var editSpan = $('<button>').attr({
                type: 'button', class: 'btn btn-success action edit',
                'data-toggle': 'modal', 'data-target': '#editModal'
            });
            var editIcon = $('<i>').attr({ class: 'fas fa-edit' });
            var deleteSpan = $('<button>').attr({ class: 'btn btn-danger action delete' });
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
});

// Does this when a child is edited. Do I even need this?
db.ref().on('child_changed', function (snapshot) {
    console.log("hehe")
    data = snapshot.val();
    console.log(data);
}, function (err) {
    console.log('This the error: ' + err.code);
});

// Adds click event for Submit Button
$('#submit').on('click', function () {
    var name = $('#name-input').val();
    var destination = $('#destination').val();
    var startTime = $('#start-time').val();
    var frequency = $('#frequency').val();

    if (name === '') {
        editDatabase.throwMainAlert('danger', 'Please enter a valid name');
        return;
    }

    if (destination === '') {
        editDatabase.throwMainAlert('danger', 'Please enter a valid destination');
        return;
    }

    if (frequency === '') {
        editDatabase.throwMainAlert('danger', 'Please enter a valid frequency');
        return;
    }

    editDatabase.throwMainAlert('success', name + " successfully added!")
    editDatabase.addTrain(name, destination, startTime, frequency);

});

// Adds click event for delete button
$(document).on('click', '.delete', function () {
    key = $(this).parent().parent().data('id');
    editDatabase.deleteTrain(key);
});

// Adds click event for edit button
$(document).on('click', '.edit', function () {
    key = $(this).parent().parent().data('id');
    $('#edit-alert').css({ opacity: 0 });
    db.ref(key).once("value", function (snapshot) {
        var data = snapshot.val();
        $('#editModalTitle').text('Editing: ' + data.name);
        $('#editModalTitle').attr({ key: key });
        $('#edit-name-input').val(data.name);
        $('#edit-destination').val(data.destination);
        $('#edit-start-time').val(data.startTime);
        $('#edit-frequency').val(data.frequency);
    })
});

// Add click event for save button in the edit window
$('#save-edit').on('click', function () {
    var key = $('#editModalTitle').attr('key');
    var name = $('#edit-name-input').val();
    var destination = $('#edit-destination').val();
    var startTime = $('#edit-start-time').val();
    var frequency = $('#edit-frequency').val();

    if (name === '') {
        editDatabase.throwEditAlert('danger', 'Please enter a valid name');
        return;
    }

    if (destination === '') {
        editDatabase.throwEditAlert('danger', 'Please enter a valid destination');
        return;
    }

    if (frequency === '') {
        editDatabase.throwEditAlert('danger', 'Please enter a valid frequency');
        return;
    }

    editDatabase.throwEditAlert('success', name + " edited!")
    editDatabase.updateTrain(key, name, destination, startTime, frequency);
    $('#editModalTitle').text('Editing: ' + name);
});