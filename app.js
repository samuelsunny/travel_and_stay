var express = require("express");
var session = require('express-session');
var app = express();
var port = 3000;
var bodyParser = require('body-parser');

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({ secret: "keyboard cat", cookie: { maxAge: 60000 }, rolling: true, resave: true, saveUninitialized: false }
    // ));

app.use(session({secret:"tdfyjgj",resave:false,saveUninitialized:true}));
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
    economy_seats : String,

});

var hotelSchema = new mongoose.Schema({
    hotelname: String,
    address: String,
    city    : String,
    country: String,
    suits: String,
    suit_price: String,
    rooms : String,
    room_price: String

});

var roomSchema = new mongoose.Schema({
    hotelId: String,
    booking_start_date: String,
    booking_end_date  : String,
    type:String,
    available: String
});

var User = mongoose.model("Users", userSchema);
var Flight = mongoose.model("Flights", flightSchema);
var Hotel = mongoose.model("Hotels", hotelSchema);
var Room = mongoose.model("Rooms",roomSchema);

app.post("/login", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    console.log(username,password);
    User.findOne({username: username, password:password},function(err,user){
        if(err)
        {
            console.log("Error part:",err);
            res.status(500).send();

        }
        console.log("After err");
        // console.log(user._doc.username == username);
        if( user && user._doc.username == username)
        {
            if( user._doc.username == "admin")
            {
                res.sendFile(__dirname + "/adminhomepage.html");
                // res.render('adminhomepage',{user: user});
                req.session.user = user;
            }
            else
            {
                console.log("Near ejs");
                // var username = user._doc.username;
                // res.render('homepage',{user: user});
                // console.log("Coming out ejs");
                res.sendFile(__dirname + "/homepage.html");
                req.session.user = user;

            }
            // req.session.user = user;
            
        }
        else{
            console.log("After ejs");
            res.sendFile(__dirname + "/login.html");
        }
    //     req.session.user = user;
    });

    
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.sendFile(__dirname + "/login.html");
});

app.get("/login", (req, res) => {
    console.log("get login 1",req.session.user);
    if(!req.session.user)
    {
        res.sendFile(__dirname + "/login.html");
    }
    else  if(req.session.user.username == "admin"){
        res.sendFile(__dirname + "/adminhomepage.html");
    }
    else{

        // console.log("get login 2",req.session.user);
        // res.render('homepage',{user: req.session.user});

        res.sendFile(__dirname + "/homepage.html");
    }
});
app.get("/", (req, res) => {
    if(!req.session.user)
    {
        res.sendFile(__dirname + "/login.html");
    }
    else  if(req.session.user.username == "admin"){
        res.sendFile(__dirname + "/adminhomepage.html");
    }
    else{
        // console.log(req.session.user);
        res.sendFile(__dirname + "/homepage.html");
        // var user = req.session.user;
        // res.render('homepage',{user: user});
    }
});

app.get("/homepage", (req, res) => {
    if(req.session.user)
    {
        // console.log(req.session.user);
        if(req.session.user.username == "admin"){
            res.sendFile(__dirname + "/adminhomepage.html");
        }
        else{
            // console.log(req.session.user);
            res.sendFile(__dirname + "/homepage.html");
        }
    }
    else{
        res.sendFile(__dirname + "/login.html");
    }

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
            var hotel_name = req.body.hotelname;
            Hotel.findOne({hotelname: hotel_name},function(err,hotel){
                if(err)
                {
                    console.log("Error part:",err);
                    res.status(500).send();

                }
                else{
                    hotel_id = hotel._id;
                    var suits = parseInt(req.body.suits);
                var rooms = parseInt(req.body.rooms);
                room_info={
                    hotelId: String(hotel._id),
                    booking_start_date: "",
                    booking_end_date  : "",
                    type:"suit",
                    available: "Yes"    

                };
                for (let i = 1; i <= suits; i++) {
                    var create_suits = new Room(room_info);
                    create_suits.save();
                }
                room_info={
                    hotelId: hotel_id,
                    booking_start_date: "",
                    booking_end_date  : "",
                    type:"room",
                    available: "Yes"    

                };
                for (let i = 1; i <= rooms; i++) {
                    var create_rooms = new Room(room_info);
                    create_rooms.save();
                }
                    }
                    
                });
                // console.log("After loop",1,2);
            
                res.sendFile(__dirname + "/success_hotel.html");
            })
            .catch(err => {
                console.log(err);
                res.status(400).send("Unable to save to database");
            });
        
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});