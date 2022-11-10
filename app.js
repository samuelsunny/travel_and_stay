var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('images'));

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/travel_and_stay");
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    name    : String,
    address: String,
    contact_number: String,
    name_on_card : String,
    card_number : String,
    expiry_date: String,
    cvv    : String,
    billing_address: String    
});

var flightSchema = new mongoose.Schema({
    flightnumber: String,
    flightname: String,
    departure_city    : String,
    arrival_city: String,
    business_seats: String,
    economy_seats : String
});

var hotelSchema = new mongoose.Schema({
    hotelname: String,
    address: String,
    city    : String,
    country: String,
    suits: String,
    rooms : String
});
// var userSchema = new mongoose.Schema({
//     firstName: String,
//     lastName: String,

// });

var User = mongoose.model("Users", userSchema);
var Flight = mongoose.model("Flights", flightSchema);
var Hotel = mongoose.model("Hotels", hotelSchema);



app.get("/", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

app.get("/createuser", (req, res) => {
    res.sendFile(__dirname + "/createaccount.html");
});

app.get("/addflight", (req, res) => {
    res.sendFile(__dirname + "/addflights.html");
});

app.get("/addhotel", (req, res) => {
    res.sendFile(__dirname + "/addhotels.html");
});

app.post("/adduser", (req, res) => {
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            res.sendFile(__dirname + "/success.html");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});

app.post("/addflight", (req, res) => {
    var myData = new Flight(req.body);
    myData.save()
        .then(item => {
            res.sendFile(__dirname + "/success_flight.html");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});

app.post("/addhotel", (req, res) => {
    var myData = new Hotel(req.body);
    myData.save()
        .then(item => {
            res.sendFile(__dirname + "/success_hotel.html");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});