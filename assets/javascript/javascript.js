var db = firebase.database().ref();

db.set({
    test: {
        name: 'hi',
        other: 222
    }
})

db.on("value", function (snapshot) {
    data = snapshot.val();
    console.log(snapshot.child('test').val());
}, function (err) {
    console.log('This the error: ' + err.code);
})

function addTrain()