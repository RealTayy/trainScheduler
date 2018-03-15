var editDatabase = {
    addTrain(name, destination, startTime, startDate, frequency) {
        db.ref().push({
            'name': name,
            'destination': destination,
            'startTime': startTime,
            'startDate': startDate,
            'frequency': frequency
        });
    },

    deleteTrain(key) {
        db.ref(key).remove();
    },

    editTrain(key, name, destination, startTime, startDate, frequency) {
        db.ref(key).set({
            'name': name,
            'destination': destination,
            'startTime': startTime,
            'startDate': startDate,
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

var schedule = {
    // This function displays list of trains in the main windows
    displayMain(trainDatabase) {
        $("#train-table").find('tbody').remove();
        for (var key in trainDatabase) {
            data = trainDatabase[key];

            // Create and build a new <tbody> to append to list of trains...
            var newTbody = $('<tbody>');
            var newTr = $('<tr>').attr({ id: key, 'data-id': key });
            var nameTh = $('<th>').attr({ scope: 'row', class: 'name' }).text(data.name);
            var destinationTh = $('<th>').attr({ class: 'destination' }).text(data.destination);
            var frequencyTh = $('<th>').attr({ class: 'frequency' }).text(data.frequency);            
            var arrivalTh = $('<th>').attr({ class: 'arrival' }).text(schedule.getArrival(data));
            var minutesawayTh = $('<th>').attr({ class: 'minutes-away' }).text(schedule.getMinsAway(data));

            // These lines create the two buttons under "Actions" that will also be appended to <tbody>
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
    },

    displayFive() {

    },

    getMinsAway(trainData) {        
        var startMoment = moment(trainData.startDate + trainData.startTime, 'YYYY-MM-DDHH:mm');
        var freq = trainData.frequency;
        var minutesDifference = moment.duration(moment().diff(startMoment)).asMinutes();
        var minutesAway = Math.ceil(freq - (minutesDifference % freq))

        return minutesAway;
    },

    getArrival(trainData) {
        var minutesAway = schedule.getMinsAway(trainData);
        var nextArrival = moment().add(minutesAway, 'minutes');
        return nextArrival.format('hh:mmA');
    }
}

var db = firebase.database();

// Does this on page load and when a new train is added
db.ref().on('value', function (snapshot) {
    data = snapshot.val();
    schedule.displayMain(data);
}, function (err) {
    console.log('This the error: ' + err.code);
});

// Adds click event for Submit Button
$('#submit').on('click', function () {
    var name = $('#name-input').val();
    var destination = $('#destination').val();
    var startTime = $('#start-time').val();
    var startDate = $('#start-date').val();
    var startMoment = moment(startDate + startTime,'YYYY-MM-DDHH:mm');
    var frequency = $('#frequency').val();    
    

    if (name === '') {
        editDatabase.throwMainAlert('danger', 'Please enter a name');
        return;
    }

    if (destination === '') {
        editDatabase.throwMainAlert('danger', 'Please enter a destination');
        return;
    }

    if (frequency === '') {
        editDatabase.throwMainAlert('danger', 'Please enter a frequency');
        return;
    }

    // Checks if date entered is greater then the current date    
    if (moment() - startMoment < 0) {
        editDatabase.throwMainAlert('danger', 'Date/Time invalid -- Train can\'t be from the future');
        return;
    }

    editDatabase.throwMainAlert('success', name + " successfully added!")
    editDatabase.addTrain(name, destination, startTime, startDate, frequency);

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

    //Pre fills form with info of train whose edit button you clicked
    db.ref(key).once("value", function (snapshot) {
        var data = snapshot.val();
        $('#editModalTitle').text('Editing: ' + data.name);
        $('#editModalTitle').attr({ key: key });
        $('#edit-name-input').val(data.name);
        $('#edit-destination').val(data.destination);
        $('#edit-start-time').val(data.startTime);
        $('#edit-start-date').val(data.startDate);
        $('#edit-frequency').val(data.frequency);
    })
});

// Add click event for save button in the edit window
$('#save-edit').on('click', function () {
    var key = $('#editModalTitle').attr('key');
    var name = $('#edit-name-input').val();
    var destination = $('#edit-destination').val();
    var startTime = $('#edit-start-time').val();
    var startDate = $('#edit-start-date').val();
    var startMoment = moment(startDate + startTime,'YYYY-MM-DDHH:mm');
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

    if (moment() - startMoment < 0) {
        editDatabase.throwEditAlert('danger', 'Date/Time invalid -- Train can\'t be from the future');
        return;
    }

    editDatabase.throwEditAlert('success', name + " edited!")
    editDatabase.editTrain(key, name, destination, startTime, startDate, frequency);
    $('#editModalTitle').text('Editing: ' + name);
});