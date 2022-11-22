var express = require("express");
var session = require('express-session');
var app = express();
var port = 3000;
var bodyParser = require('body-parser');

// set the view engine to ejs
app.set('view engine', 'ejs');
// Setting wherre the views would accessed from.
app.set('views',__dirname+'/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({ secret: "keyboard cat", cookie: { maxAge: 60000 }, rolling: true, resave: true, saveUninitialized: false }
    // ));

app.use(session({secret:"tdfyjgj",resave:false,saveUninitialized:true}));
app.use(express.static('images'));
app.use(express.static('views'));



var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/travel_and_stay");
var userSchema = new mongoose.Schema({
    account_type:String,
    username: String,
    password: String,
    name    : String,
    address: String,
    city    : String,
    country : String,
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
    departure_airport: String,
    arrival_airport: String,
    departure_city    : String,
    arrival_city: String,
    departure_date    : String,
    arrival_date: String,
    departure_time    : String,
    arrival_time: String,
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
    hotel_name:String,
    hotel_address:String,
    name   : String,
    price  : String,
    amenities:String,
    city: String,
    country: String,
    booking_start_date: String,
    booking_end_date  : String,
    type:String,
    available: String
});

var roomcartSchema = new mongoose.Schema({
    userId          : String,
    roomId          : String,
    hotel_name      : String,
    type            : String,    
    amenities       : String,
    city            : String,
    check_in_date   : String,
    check_out_date  : String,
    type            : String,
    price           : String
});
var bookings_rooms_Schema = new mongoose.Schema({
    userId          : String,
    roomId          : String,
    hotel_name      : String,
    type            : String,    
    amenities       : String,
    city            : String,
    check_in_date   : String,
    check_out_date  : String,
    type            : String,
    price           : String
});


var flightcartSchema = new mongoose.Schema({
    userId          : String,
    flightId          : String,
    flight_name      : String,
    flightnumber    : String,    
    departure_airport       : String,
    arrival_airport            : String,
    departure_date   : String,
    arrival_date  : String,
    departure_time            : String,
    arrival_time           : String
});

var bookings_flights_Schema = new mongoose.Schema({
    userId          : String,
    flightId          : String,
    flight_name      : String,
    flightnumber    : String,    
    departure_airport       : String,
    arrival_airport            : String,
    departure_date   : String,
    arrival_date  : String,
    departure_time            : String,
    arrival_time           : String
});



var User = mongoose.model("Users", userSchema);
var Flight = mongoose.model("Flights", flightSchema);
var Hotel = mongoose.model("Hotels", hotelSchema);
var Room = mongoose.model("Rooms",roomSchema);
var RoomCart =  mongoose.model("Rooms_cart",roomcartSchema);
var RoomBookings =  mongoose.model("Rooms_bookings",bookings_rooms_Schema);
var FlightCart =  mongoose.model("Flights_cart",flightcartSchema);
var FlightBookings = mongoose.model("Flight_bookings",bookings_flights_Schema);


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
                req.session.user = user;
                // res.sendFile(__dirname + "/adminhomepage.html");
                res.render('adminhomepage',{user: req.session.user});
               
            }
            else if(user._doc.account_type == "hotel")
            {
                req.session.user = user;
                // console.log("Near ejs");
                // var username = user._doc.username;
                res.render('hotelmanagement',{user: req.session.user});
            }
            else
            {
                console.log("Near ejs");

                req.session.user = user;
                // console.log("Near ejs");
                // var username = user._doc.username;
                res.render('homepage',{user: req.session.user});
                console.log("Coming out ejs");
                
                // res.sendFile(__dirname + "/homepage.html");
                
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
        res.render('adminhomepage',{user: req.session.user});
        // res.sendFile(__dirname + "/adminhomepage.html");
    }
    else if (req.session.user.account_type == "hotel"){
        res.render('hotelmanagement',{user: req.session.user});
    }
    else{
        res.render('homepage',{user: req.session.user});
        // res.sendFile(__dirname + "/homepage.html");
    }
});
app.get("/", (req, res) => {
    if(!req.session.user)
    {
        res.sendFile(__dirname + "/login.html");
    }
    // console.log("Session:",req.session.user,req.session);
    else if(req.session.user.username == "admin"){
        res.render('adminhomepage',{user: req.session.user});
        // res.sendFile(__dirname + "/adminhomepage.html");
    }
    else if (req.session.user._doc.account_type == "hotel"){
        res.render('hotelmanagement',{user: req.session.user});
    }
    else{
        res.render('homepage',{user: req.session.user});
        // res.sendFile(__dirname + "/homepage.html");
    }
});

app.get("/homepage", (req, res) => {
    if(req.session.user)
    {
        if(req.session.user.username == "admin"){
            res.render('adminhomepage',{user: req.session.user});
            // res.sendFile(__dirname + "/adminhomepage.html");
        }
        else if (req.session.user.account_type == "hotel"){
            res.render('hotelmanagement',{user: req.session.user});
        }
        else{
            res.render('homepage',{user: req.session.user});
            // res.sendFile(__dirname + "/homepage.html");
        }
    }
    else{
        res.sendFile(__dirname + "/login.html");
    }

});

app.get("/createuser", (req, res) => {
    
    res.sendFile(__dirname + "/createaccount.html");
  
});

app.get("/createhoteluser", (req, res) => {
    
    res.sendFile(__dirname + "/createhotelaccount.html");
  
});

app.get("/addflight", (req, res) => {
    if(req.session.user)
    {
        res.sendFile(__dirname + "/addflights.html");
    }
    else{
        res.sendFile(__dirname + "/login.html");
    }
});

app.get("/addsuit", (req, res) => {
    if(req.session.user)
    {
        res.sendFile(__dirname + "/addsuit.html");
    }
    else{
        res.sendFile(__dirname + "/login.html");
    }
});

app.post("/addsuit", (req, res) => {
    if(req.session.user)
    {
        var suit_name = req.body.suit_name;
        var suit_price = req.body.suit_price;
        var amenities = req.body.amenities;
        var hotel_id = req.session.user._id;
        var city = req.session.user.city;
        var country = req.session.user.country;
        var hotel_address = req.session.user.address;
        var hotel_name = req.session.user.name;
        var suit_details ={
            hotelId             : hotel_id,
            hotel_name          : hotel_name,
            hotel_address       : hotel_address,
            name                : suit_name,
            price               : suit_price,
            amenities           : amenities,
            city                : city,
            country             : country,
            booking_start_date  : "",
            booking_end_date    : "",
            type                :"suit",
            available           : "yes"
        }
        var myData = new Room(suit_details);
        myData.save()
            .then(item => {
                res.sendFile(__dirname + "/success_hotel.html");
            })
            .catch(err => {
                res.status(400).send("Unable to save to database");
            });

        // res.sendFile(__dirname + "/addsuit.html");
    }
    else{
        res.sendFile(__dirname + "/login.html");
    }
});

app.get("/addroom", (req, res) => {
    if(req.session.user)
    {
        res.sendFile(__dirname + "/addroom.html");
    }
    else{
        res.sendFile(__dirname + "/login.html");
    }
});

app.post("/addroom", (req, res) => {
    if(req.session.user)
    {
        var room_name = req.body.room_name;
        var room_price = req.body.room_price;
        var amenities = req.body.amenities;
        var hotel_id = req.session.user._id;
        var city = req.session.user.city;
        var country = req.session.user.country;
        var hotel_address = req.session.user.address;
        var hotel_name = req.session.user.name;
        var room_details ={
            hotelId             : hotel_id,
            hotel_name          : hotel_name,
            hotel_address       : hotel_address,
            name                : room_name,
            price               : room_price,
            amenities           : amenities,
            city                : city,
            country             : country,
            booking_start_date  : "",
            booking_end_date    : "",
            type                :"room",
            available           : "yes"
        }
        var myData = new Room(room_details);
        myData.save()
            .then(item => {
                res.sendFile(__dirname + "/success_hotel.html");
            })
            .catch(err => {
                res.status(400).send("Unable to save to database");
            });

        // res.sendFile(__dirname + "/addsuit.html");
    }
    else{
        res.sendFile(__dirname + "/login.html");
    }
});

app.post("/adduser", (req, res) => {
    
        var account_type = "individual"
        var username = req.body.username;
        var password = req.body.password;
        var name = req.body.name;
        var address = req.body.address;
        var city = req.body.city; 
        var country = req.body.country; 
        var contact_number = req.body.contact_number;
        var name_on_card = req.body.name_on_card;
        var card_number = req.body.card_number;
        var expiry_date = req.body.expiry_date;
        var cvv = req.body.cvv;
        var billing_address = req.body.billing_address;

        var account_details = {
            account_type: account_type,
            username    : username,
            password    : password,
            name        : name,
            address     : address,
            city        : city,
            country     : country,
            contact_number : contact_number,
            name_on_card : name_on_card,
            card_number : card_number,
            expiry_date : expiry_date,
            cvv         : cvv,
            billing_address: billing_address
        }


        var myData = new User(account_details);
        myData.save()
            .then(item => {
                res.sendFile(__dirname + "/success.html");
            })
            .catch(err => {
                res.status(400).send("Unable to save to database");
            });  
    
});

app.post("/addhoteluser", (req, res) => {
    
    var account_type = "hotel"
    var username = req.body.username;
    var password = req.body.password;
    var name = req.body.name;
    var address = req.body.address;
    var city = req.body.city; 
    var country = req.body.country; 
    var contact_number = req.body.contact_number;
    var name_on_card = req.body.name_on_card;
    var card_number = req.body.card_number;
    var expiry_date = req.body.expiry_date;
    var cvv = req.body.cvv;
    var billing_address = req.body.billing_address;

    var account_details = {
        account_type: account_type,
        username    : username,
        password    : password,
        name        : name,
        address     : address,
        city        : city,
        country     : country,
        contact_number : contact_number,
        name_on_card : name_on_card,
        card_number : card_number,
        expiry_date : expiry_date,
        cvv         : cvv,
        billing_address: billing_address
    }


    var myData = new User(account_details);
    myData.save()
        .then(item => {
            res.sendFile(__dirname + "/success.html");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });  

});

app.post("/addflight", (req, res) => {
    if(req.session.user && req.session.user.username=="admin")
    {
        var myData = new Flight(req.body);
        myData.save()
            .then(item => {
                res.sendFile(__dirname + "/success_flight.html");
            })
            .catch(err => {
                res.status(400).send("Unable to save to database");
            });
    }
    else{
        res.sendFile(__dirname + "/login.html");
    }
});

app.post("/addhotel", (req, res) => {
    if(req.session.user)
    {
        var city = req.body.city;
        var city_name = city.toLowerCase(); 
        var country = req.body.country;
        var country_name = country.toLowerCase(); 
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
                            hotelId:hotel._id,
                            city:city_name,
                            country:country_name,
                            booking_start_date: "",
                            booking_end_date  : "",
                            type:"suite",
                            available: "Yes"    

                        };
                        for (let i = 1; i <= suits; i++) {
                            var create_suits = new Room(room_info);
                            create_suits.save();
                        }
                        room_info={
                            hotelId: hotel_id,
                            city:city_name,
                            country:country_name,
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
    }
    else{
        res.sendFile(__dirname + "/login.html");
    }   
});

app.get("/searchhotels", (req, res) => {
    if(req.session.user)
    {
        res.render('searchhotels',{user: req.session.user});
        // res.sendFile(__dirname + "/homepage.html");
    }
    else{
        res.sendFile(__dirname + "/login.html");
    }
});

app.post("/searchhotels", (req, res) => {
    var check_in = req.body.check_in;
    var check_out = req.body.check_out;
    var city = req.body.city;
    var city_name = city.toLowerCase(); 
    var country = req.body.country;
    var people = req.body.people;
    var country_name = country.toLowerCase(); 
    var selection = req.body.selection;
    if(selection == 1)
    {
        preference = "suite";
    }
    else
    {   
        preference = "room";
    }
    console.log(city,selection);

    if(req.session.user)
    {
        Room.find({booking_start_date: {$ne:check_out}, booking_end_date:{$ne:check_in},type:preference,
                   city:city_name,country:country_name},function(err,results){
            if(err)
            {
                console.log("Error part:",err);
                res.status(500).send();
    
            }
            console.log("Ready:",results.length);
            var rooms = [];
            for (let i = 0; i < results.length; i++) {
                rooms[i] = results[i]._doc;
            }
            console.log("Rooms:",rooms);


            if( results.length == 0)
            {
                res.render('no_hotels_found',{user: req.session.user});
            }
                // req.session.user = user;
            else{
                res.render('hotel_search_results',{user: req.session.user,search_results: results,city:city,
                                                    country:country,check_in:check_in,check_out:check_out,
                                                    people:people,preference:selection

                                                  });
            }   
            // }
            // else{
            //     console.log("After ejs");
            //     res.sendFile(__dirname + "/login.html");
            // }
        //     req.session.user = user;
        });
        // res.render('searchhotels',{user: req.session.user});
        // res.sendFile(__dirname + "/homepage.html");
    }
    else{
        res.sendFile(__dirname + "/login.html");
    }
});


app.get("/searchflights", (req, res) => {
    if(req.session.user)
    {
        res.render('searchflights',{user: req.session.user});
        // res.sendFile(__dirname + "/homepage.html");
    }
    else{
        res.sendFile(__dirname + "/login.html");
    }
});

app.post("/searchflights", (req, res) => {
    var departure_city = req.body.departure_city;
    var departure_city_name = departure_city.toLowerCase();
    var destination_city = req.body.destination_city;
    try {
        var destination_city_name = destination_city.toLowerCase();
    }
    catch(err) {
        var destination_city_name = "";
    }

    var travel_date = req.body.travel_date;
    var return_date = req.body.return_date;

    var people =  req.body.people;
    var selection = req.body.selection;
    if(selection == 1)
    {
        preference = "Business";
    }
    else
    {   
        preference = "Economy";
    }
    console.log("search:",departure_city_name,destination_city_name,travel_date,return_date,people,preference);
    if(req.session.user)
    {
        if(return_date != "")
        {
            Flight.find({departure_date: travel_date, arrival_date:return_date,departure_city:String(departure_city_name),
                arrival_city:String(destination_city_name)},function(err,results){
                if(err)
                {
                    console.log("Error part:",err);
                    res.status(500).send();
        
                }
                console.log("Ready:",results.length);
                var rooms = [];
                for (let i = 0; i < results.length; i++) {
                    rooms[i] = results[i]._doc;
                }
                // console.log("Rooms:",rooms);


                if( results.length == 0)
                {
                    res.render('no_flights_found',{user: req.session.user});
                }
                    // req.session.user = user;
                else{
                    res.render('flight_search_results',{user: req.session.user,search_results: results,departure_city:departure_city_name,
                        destination_city:destination_city_name,travel_date:travel_date,return_date:return_date,
                                                        people:people,preference:selection

                                                    });
                }   
                // }
                // else{
                //     console.log("After ejs");
                //     res.sendFile(__dirname + "/login.html");
                // }
            //     req.session.user = user;
            });
            // res.render('searchhotels',{user: req.session.user});
            // res.sendFile(__dirname + "/homepage.html");
        }
        else
        {
            console.log("Inside flights");
            Flight.find({departure_date: travel_date,departure_city:String(departure_city_name),arrival_city:String(destination_city_name)},function(err,results){
                    if(err)
                    {
                        console.log("Error part:",err);
                        res.status(500).send();
            
                    }
                    console.log("Ready:",results.length);
                    var rooms = [];
                    for (let i = 0; i < results.length; i++) {
                        rooms[i] = results[i]._doc;
                    }
                    console.log("Rooms 1:",rooms);


                    if( results.length == 0)
                    {
                        res.render('no_flights_found',{user: req.session.user});
                    }
                        // req.session.user = user;
                    else{
                        res.render('flight_search_results',{user: req.session.user,search_results: results,departure_city:departure_city_name,
                            destination_city:destination_city_name,travel_date:travel_date,return_date:return_date,
                                                            people:people,preference:selection
    
                                                        });
                    }   
                    // }
                    // else{
                    //     console.log("After ejs");
                    //     res.sendFile(__dirname + "/login.html");
                    // }
                //     req.session.user = user;
                });
                // res.render('searchhotels',{user: req.session.user});
                // res.sendFile(__dirname + "/homepage.html");
        }
        
    }
    else{
        res.sendFile(__dirname + "/login.html");
    }
});

app.get("/editprofile", (req, res) => {
    if(req.session.user)
    {
        
        res.render('editprofile',{user: req.session.user});
        // res.sendFile(__dirname + "/homepage.html");
    }
    else{
        res.sendFile(__dirname + "/login.html");
    }
});

app.post("/editprofile", async (req, res) => {
    if(req.session.user)
    {
        var account_type =  req.session.user.account_type;
        var username = req.body.username;
        var password = req.body.password;
        var name = req.body.name;
        var address = req.body.address;
        var city = req.body.city; 
        var country = req.body.country; 
        var contact_number = req.body.contact_number;
        var name_on_card = req.body.name_on_card;
        var card_number = req.body.card_number;
        var expiry_date = req.body.expiry_date;
        var cvv = req.body.cvv;
        var billing_address = req.body.billing_address;

        var account_details = {
            account_type: account_type,
            username    : username,
            password    : password,
            name        : name,
            address     : address,
            city        : city,
            country     : country,
            contact_number : contact_number,
            name_on_card : name_on_card,
            card_number : card_number,
            expiry_date : expiry_date,
            cvv         : cvv,
            billing_address: billing_address
        }
        console.log("Account details:", account_details,req.session.user._id);
        var updated_details = await User.findOneAndUpdate(
            { username: req.session.user.username },
            account_details,
            // If `new` isn't true, `findOneAndUpdate()` will return the
            // document as it was _before_ it was updated.
            { new: true }
          );
        console.log("updated details:",updated_details);
        res.render('editprofile',{user: updated_details});
        // res.sendFile(__dirname + "/homepage.html");
    }
    else{
        res.sendFile(__dirname + "/login.html");
    }
});

app.post("/add_to_cart", (req, res) => {
    if(req.session.user)
    {
        var roomId =  req.body.roomId;
        var hotel_name =  req.body.hotel_name;
        var type =  req.body.type;

        var roomId_object = mongoose.Types.ObjectId(String(roomId));
        var people = req.body.people;
        var preference = req.body.preference;
        var check_in_date = req.body.check_in_date;
        var check_out_date = req.body.check_out_date;
        console.log("to add to cart:",roomId_object,roomId,check_in_date,check_out_date);
        Room.findById({_id: String(roomId)},function(err,room){
            if(err)
            {
                console.log("Error part:",err);
                res.status(500).send();

            }
            else
            {
                console.log("room details:",room);
            // var name = req.body.name;
            // var address = req.body.address;
            // var city = req.body.city; 
            // var country = req.body.country; 
            // var contact_number = req.body.contact_number;
            // var name_on_card = req.body.name_on_card;
            // var card_number = req.body.card_number;
            // var expiry_date = req.body.expiry_date;
            // var cvv = req.body.cvv;
            // var billing_address = req.body.billing_address;

                var room_details = {
                    userId      : req.session.user._id,
                    roomId      : String(roomId),
                    hotel_name  : hotel_name,
                    type        : type,
                    amenities   : room.amenities,
                    city        : room.city,
                    check_in_date  : check_in_date,
                    check_out_date : check_out_date,
                    type        : room.type,
                    price       : room.price
                }
                RoomCart.find({roomId: roomId, userId : req.session.user._id},function(err,results){
                    if(err)
                    {
                        console.log("Error part:",err);
                        res.status(500).send();
            
                    }

                    if( results.length == 0)
                    {
                        var add_rooms_to_cart = new RoomCart(room_details);
                        add_rooms_to_cart.save();
                    }
                    else{
                        Room.find({booking_start_date: {$ne:check_out_date}, booking_end_date:{$ne:check_in_date},type:room.type,
                            city:room.city,country:room.country},function(err,results){
                            if(err)
                            {
                                console.log("Error part:",err);
                                res.status(500).send();
                    
                            }
                            console.log("Ready:",results.length);
                            var rooms = [];
                            for (let i = 0; i < results.length; i++) {
                                rooms[i] = results[i]._doc;
                            }
                            console.log("Rooms:",rooms);
    
    
                            if( results.length == 0)
                            {
                                res.render('no_hotels_found',{user: req.session.user});
                            }
                                // req.session.user = user;
                            else{
                                res.render('hotel_search_results',{user: req.session.user,search_results: results,city:room.city,
                                                                    country:room.country,check_in:check_in_date,check_out:check_out_date,
                                                                    people:people,preference:preference
    
                                                                });
                            }   
                        });
                    }
                    
                });


            // console.log("Account details:", account_details,req.session.user._id);
            // var updated_details = await User.findOneAndUpdate(
            //     { username: req.session.user.username },
            //     account_details,
            //     // If `new` isn't true, `findOneAndUpdate()` will return the
            //     // document as it was _before_ it was updated.
            //     { new: true }
            //   );
            // });
            }
        });

    }
        

        // console.log("add to cart_details:",roomId,check_in_date,check_out_date);
        // res.render('editprofile',{user: updated_details});
        // // res.sendFile(__dirname + "/homepage.html");
    else{
        res.sendFile(__dirname + "/login.html");
    }

});

app.post("/add_flight_to_cart", (req, res) => {
    if(req.session.user)
    {
        var flight_id =  req.body.flight_id;
        var flight_name =  req.body.flight_name;
        var flightnumber =  req.body.flightnumber;

        var departure_airport = req.body.departure_airport;
        var arrival_airport = req.body.arrival_airport;
        var departure_date = req.body.departure_date;
        var arrival_date = req.body.arrival_date;
        var departure_time = req.body.departure_time;
        var arrival_time = req.body.arrival_time;
        // console.log("to add to cart:",roomId_object,roomId,check_in_date,check_out_date);
        Flight.findById({_id: String(flight_id)},function(err,room){
            if(err)
            {
                console.log("Error part:",err);
                res.status(500).send();

            }
            else
            {
                console.log("room details:",room);
            // var name = req.body.name;
            // var address = req.body.address;
            // var city = req.body.city; 
            // var country = req.body.country; 
            // var contact_number = req.body.contact_number;
            // var name_on_card = req.body.name_on_card;
            // var card_number = req.body.card_number;
            // var expiry_date = req.body.expiry_date;
            // var cvv = req.body.cvv;
            // var billing_address = req.body.billing_address;

            var flight_details = {
                userId      : req.session.user._id,
                flight_id      : flight_id,
                flight_name  : flight_name,
                flightnumber        : flightnumber,
                departure_airport   : departure_airport,
                arrival_airport        : arrival_airport,
                departure_date  : departure_date,
                arrival_date : arrival_date,
                departure_time        : departure_time,
                arrival_time       : arrival_time
            }
                FlightCart.find({flightId: flight_id, userId : req.session.user._id},function(err,results){
                    if(err)
                    {
                        console.log("Error part:",err);
                        res.status(500).send();
            
                    }

                    if( results.length == 0)
                    {
                        var add_flights_to_cart = new FlightCart(flight_details);
                        add_flights_to_cart.save();
                    }
                    else{
                        if(return_date != "")
        {
            Flight.find({departure_date: travel_date, arrival_date:arrival_date,departure_city_name:departure_city,
                destination_city_name:destination_city},function(err,results){
                if(err)
                {
                    console.log("Error part:",err);
                    res.status(500).send();
        
                }
                console.log("Ready:",results.length);
                var rooms = [];
                for (let i = 0; i < results.length; i++) {
                    rooms[i] = results[i]._doc;
                }
                // console.log("Rooms:",rooms);


                if( results.length == 0)
                {
                    res.render('no_flights_found',{user: req.session.user});
                }
                    // req.session.user = user;
                else{
                    res.render('flight_search_results',{user: req.session.user,search_results: results,departure_city:departure_city_name,
                        destination_city:destination_city_name,travel_date:travel_date,return_date:return_date,
                                                        people:people,preference:selection

                                                    });
                }   
                // }
                // else{
                //     console.log("After ejs");
                //     res.sendFile(__dirname + "/login.html");
                // }
            //     req.session.user = user;
            });
            // res.render('searchhotels',{user: req.session.user});
            // res.sendFile(__dirname + "/homepage.html");
        }
        else
        {
            console.log("Inside flights");
            Flight.find({departure_date: travel_date},function(err,results){
                    if(err)
                    {
                        console.log("Error part:",err);
                        res.status(500).send();
            
                    }
                    console.log("Ready:",results.length);
                    var rooms = [];
                    for (let i = 0; i < results.length; i++) {
                        rooms[i] = results[i]._doc;
                    }
                    console.log("Rooms 1:",rooms);


                    if( results.length == 0)
                    {
                        res.render('no_flights_found',{user: req.session.user});
                    }
                        // req.session.user = user;
                    else{
                        res.render('flight_search_results',{user: req.session.user,search_results: results,departure_city:departure_city_name,
                            destination_city:destination_city_name,travel_date:travel_date,return_date:return_date,
                                                            people:people,preference:selection
    
                                                        });
                    }   
                    // }
                    // else{
                    //     console.log("After ejs");
                    //     res.sendFile(__dirname + "/login.html");
                    // }
                //     req.session.user = user;
                });
                // res.render('searchhotels',{user: req.session.user});
                // res.sendFile(__dirname + "/homepage.html");
        }
                    }
                    
                });


            // console.log("Account details:", account_details,req.session.user._id);
            // var updated_details = await User.findOneAndUpdate(
            //     { username: req.session.user.username },
            //     account_details,
            //     // If `new` isn't true, `findOneAndUpdate()` will return the
            //     // document as it was _before_ it was updated.
            //     { new: true }
            //   );
            // });
            }
        });

    }
        

        // console.log("add to cart_details:",roomId,check_in_date,check_out_date);
        // res.render('editprofile',{user: updated_details});
        // // res.sendFile(__dirname + "/homepage.html");
    else{
        res.sendFile(__dirname + "/login.html");
    }

});

app.post("/book_now", (req, res) => {
    if(req.session.user)
    {
        console.log("in bookings:");
        var roomId =  req.body.roomId;
        var hotel_name =  req.body.hotel_name;
        var type =  req.body.type;

        var roomId_object = mongoose.Types.ObjectId(String(roomId));
        var people = req.body.people;
        var preference = req.body.preference;
        var check_in_date = req.body.check_in_date;
        var check_out_date = req.body.check_out_date;
        Room.findById({_id: String(roomId)},function(err,room){
            if(err)
            {
                console.log("Error part:",err);
                res.status(500).send();

            }
            else
            {
                console.log("room details:",room)

                var room_details = {
                    userId      : req.session.user._id,
                    roomId      : String(roomId),
                    hotel_name  : hotel_name,
                    type        : type,
                    amenities   : room.amenities,
                    city        : room.city,
                    check_in_date  : check_in_date,
                    check_out_date : check_out_date,
                    type        : room.type,
                    price       : room.price
                }
                res.render('checkout_booking',{user: req.session.user,booking_details: room_details});
            }
        });
    }
      
    else{
        res.sendFile(__dirname + "/login.html");
    }

});

app.post("/book_room", (req, res) => {
    if(req.session.user)
    {
        var  roomId =  req.body.roomId;
        console.log("in bookings:");
        var room_details= { 
             userId : req.session.user._id,
             roomId :  req.body.roomId,
             hotel_name :  req.body.hotel_name,
             type :  req.body.type,
             check_in_date :  req.body.check_in_date,
             check_out_date :  req.body.check_out_date,
             city :  req.body.city,
             amenities :  req.body.amenities,
             price :  req.body.price};
       

        RoomBookings.find({roomId: roomId, userId : req.session.user._id},function(err,results){
                if(err)
                {
                    console.log("Error part:",err);
                    res.status(500).send();
        
                }

                if( results.length == 0 || results.length == undefined)
                {
                    var add_rooms_to_bookings = new RoomBookings(room_details);
                    add_rooms_to_bookings.save();
                    res.sendFile(__dirname + "/success_booking.html");

                }
                
                    });
                
    }
       
    else{
        res.sendFile(__dirname + "/login.html");
    }

});

app.post("/book_flight_now", (req, res) => {
    if(req.session.user)
    {
        console.log("in bookings:");
        var flight_id =  req.body.flight_id;
        var flight_name =  req.body.flight_name;
        var flightnumber =  req.body.flightnumber;

        var departure_airport = req.body.departure_airport;
        var arrival_airport = req.body.arrival_airport;
        var departure_date = req.body.departure_date;
        var arrival_date = req.body.arrival_date;
        var departure_time = req.body.departure_time;
        var arrival_time = req.body.arrival_time;

        Flight.findById({_id: String(flight_id)},function(err,room){
            if(err)
            {
                console.log("Error part:",err);
                res.status(500).send();

            }
            else
            {
                console.log("room details:",room)

                var flight_details = {
                    userId      : req.session.user._id,
                    flight_id      : flight_id,
                    flight_name  : flight_name,
                    flightnumber        : flightnumber,
                    departure_airport   : departure_airport,
                    arrival_airport        : arrival_airport,
                    departure_date  : departure_date,
                    arrival_date : arrival_date,
                    departure_time        : departure_time,
                    arrival_time       : arrival_time
                }
                res.render('checkout_flight_booking',{user: req.session.user,booking_details: flight_details});
            }
        });
    }
      
    else{
        res.sendFile(__dirname + "/login.html");
    }

});

app.post("/book_flight", (req, res) => {
    if(req.session.user)
    {
        var  flight_id =  req.body.flight_id;
        console.log("in bookings:");
        var flight_details= { 
             userId : req.session.user._id,
             flight_id :  req.body.flight_id,
             flight_name :  req.body.flight_name,
             flightnumber :  req.body.flightnumber,
     
             departure_airport : req.body.departure_airport,
             arrival_airport : req.body.arrival_airport,
             departure_date : req.body.departure_date,
             arrival_date : req.body.arrival_date,
             departure_time : req.body.departure_time,
             arrival_time : req.body.arrival_time};
       

             FlightBookings.find({flightId: flight_id, userId : req.session.user._id},function(err,results){
                if(err)
                {
                    console.log("Error part:",err);
                    res.status(500).send();
        
                }

                if( results.length == 0 || results.length == undefined)
                {
                    var add_flights_to_bookings = new FlightBookings(flight_details);
                    add_flights_to_bookings.save();
                    res.sendFile(__dirname + "/success_booking.html");

                }
                
                    });
                
    }
       
    else{
        res.sendFile(__dirname + "/login.html");
    }

});

app.get("/viewcart", (req, res) => {


    if(req.session.user && req.session.user.account_type == 'individual')
    {
                RoomCart.find({userId: req.session.user._id},function(err,results){
                    if(err)
                    {
                        console.log("Error part:",err);
                        res.status(500).send();
                    }
                    else
                    {
                        var total_cost = 0;
                        console.log("Ready:",results.length);
                        var rooms = [];
                        for (let i = 0; i < results.length; i++) {
                            rooms[i] = results[i]._doc;
                            total_cost += parseInt(results[i]._doc.price);
                        }
                        // console.log("Rooms:",rooms);
            
            
                        if( results.length == 0)
                        {
                            res.render('cart_empty',{user: req.session.user});
                        }
    
               
                                else{
                                    res.render('viewcart',{user: req.session.user,search_results: results,flights_results:flights_results,total_cost:total_cost});  
                                }
                            }
                        });
                    
                            }
        
        
    
    
        // res.render('viewcart',{user: req.session.user,});
        // res.sendFile(__dirname + "/homepage.html");
    else if(req.session.user && req.session.user.account_type == 'admin')
    {

        res.render('admin',{user: req.session.user});
        // res.sendFile(__dirname + "/homepage.html");
    }
    else if(req.session.user && req.session.user.account_type == 'hotel')
    {

        res.render('hotelmanagement',{user: req.session.user});
        // res.sendFile(__dirname + "/homepage.html");
    }
    else{
        res.sendFile(__dirname + "/login.html");
    }
});


app.post("/deletecartitem", (req, res) => {

    if(req.session.user && req.session.user.account_type == 'individual')
    {
        console.log("Inside cart del");
        var roomId =  req.body.roomId;
        console.log("roomid", roomId);

        // RoomCart.deleteOne({ roomId: roomId });
        RoomCart.deleteOne({ roomId: String(roomId),userId: req.session.user._id},function(err,results){
        if(err)
        {
            console.log("Error part:",err);
            res.status(500).send();

        }
        else
        {
            var total_cost = 0;
            console.log("Ready:",results.length);
            var rooms = [];
            for (let i = 0; i < results.length; i++) {
                rooms[i] = results[i]._doc;
                total_cost += parseInt(results[i]._doc.price);
            }
            // console.log("Rooms:",rooms);
            if( results.length == 0 )
            {
               results=[];
            }
            if( flights_results.length == 0 )
            {
                flights_results=[];
            }

            if( results.length == 0 && results.length == undefined)
            {
                res.render('cart_empty',{user: req.session.user});
            }
                // req.session.user = user;
            else
            {
                res.render('viewcart',{user: req.session.user,search_results: results,flights_results:flights_results,total_cost:total_cost});  
            }  
        }
        });
    }
        // res.render('viewcart',{user: req.session.user,});
        // res.sendFile(__dirname + "/homepage.html");
    else if(req.session.user && req.session.user.account_type == 'admin')
    {

        res.render('admin',{user: req.session.user});
        // res.sendFile(__dirname + "/homepage.html");
    }
    else if(req.session.user && req.session.user.account_type == 'hotel')
    {

        res.render('hotelmanagement',{user: req.session.user});
        // res.sendFile(__dirname + "/homepage.html");
    }
    else{
        res.sendFile(__dirname + "/login.html");
    }
});

// app.get("*", (req, res) => {
//     console.log("In default route");
//     if(req.session.user)
//     {

//         res.render('homepage',{user: req.session.user});
//         // res.sendFile(__dirname + "/homepage.html");
//     }
//     else{
//         res.sendFile(__dirname + "/login.html");
//     }
// });


app.listen(port, () => {
    console.log("Server listening on port " + port);
});