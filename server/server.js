const express = require('express');
const parkingApp = express();
const port = process.env.port || 8000;
const data = require("../app/src/data.json");

parkingApp.use(express.json());

parkingApp.get('/', (req, res) => res.send('Parking App TEC'));

parkingApp.get('/spaces', (req, res) => {
    res.json(data.spaces);  
})

parkingApp.get('/spaces/free', (req, res) => {
    var result = data.spaces.filter(e => e.state == "free");
    res.json(result);
    console.log(result);
})

parkingApp.get('/spaces/in-use', (req, res) => {
    var result = data.spaces.filter(e => e.state == "in-use");
    res.json(result);
    console.log(result);
})

parkingApp.get('/spaces/:id', (req, res) => {  
    var result = data.spaces.filter(e => e.id == req.params.id);
    res.json(result);
    console.log(result);
})

parkingApp.post('/spaces', (req, res) => {
    var currentId = data.spaces.length + 1;
    data["spaces"].push({ id : currentId , state : "free" });

    res.json(data.spaces);
    console.log(data.spaces);
})

parkingApp.put('/spaces/:id', (req, res) => {
    
    var newId = req.body.id;
    var newState = req.body.state;

    data["spaces"][req.params.id - 1]["id"] = newId;
    data["spaces"][req.params.id - 1]["state"] = newState;

    res.json(data.spaces);
    console.log(data.spaces);


})

parkingApp.delete('/spaces/:id', (req, res) => {
    var spaceCheck = data.spaces.filter(e => e.id == req.params.id);
    if (spaceCheck.length > 0){
        if (spaceCheck[0].state === "free"){
            data["spaces"].splice(req.params.id - 1 , 1);
        }
        res.json(data.spaces);
        console.log(data.spaces);
    }
})

parkingApp.get('/reservations', (req, res) => {
    res.json(data.reservations);
})

parkingApp.post('/reservations', (req, res) => {

    var newPlate = req.body.plateNumber;
    var newSpaceID = -1;
    
    for (var i in data.spaces){
        if (data.spaces[i]["state"] == "free"){
            newSpaceID = data.spaces[i]["id"];
            break;

        }
    }
    var newCheckIn = new Date().toUTCString();

    var spaceCheck = data.spaces.filter(e => e.id == newSpaceID);
    if (spaceCheck.length > 0) {
        if (spaceCheck[0].state === "free"){
            data["spaces"][newSpaceID - 1]["state"] = "in-use";
            data["reservations"].push({ plateNumber : newPlate ,
                                         spaceID : newSpaceID, 
                                         checkinTime : newCheckIn });
            res.json(data.reservations);
            console.log(data.reservations);
        }

    }
})

parkingApp.delete('/reservations/:id', (req, res) => {

    var reserveCheck = data.reservations.filter(e => e.plateNumber == req.params.id);
    var reserveId = -1
    var currentSpaceID = -1

    if (reserveCheck.length > 0){
        for (var i in data.reservations){
            if (data.reservations[i]["plateNumber"] == req.params.id){
                reserveId = i;
                currentSpaceID = data.reservations[i]["spaceID"];
                break;
            }
        }

        data["spaces"][currentSpaceID - 1]["state"] = "free";
        data["reservations"].splice(reserveId, 1);

        res.json(data.reservations);
    }
})

parkingApp.listen(port, () => console.log(`Server app listening on port ${port}!`));

