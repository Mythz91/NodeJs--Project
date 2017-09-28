var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer();
var mongoC = require("mongodb").MongoClient;
var errors = require("errors");
var mailer = require("nodemailer");
var ejs = require("ejs");
app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

var transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mythili1866@gmail.com',
        pass: '27001414'
    }
});

var url = "mongodb://localhost:27017/medicalInsights";
mongoC.connect(url, function(err, db) {
    if (err) throw err;
    console.log("database connected");
    app.post("/checkReg", function(req, res) {

        var data = req.body;
        console.log(data)
       

        db.collection("UserDetails").find({ "registrationNumber": data.registration }).toArray(function(err, result) {
            if (err) {
                throw err;
            } else {
            	console.log(result.length);
                if (result.length == 0) {
                     res.send("0");
                    res.end();
                } else{
                	res.send("1");
                    res.end();
                }
            }
            console.log(result)
        });

    })

    app.post("/register", function(req, res) {
        var data = req.body;
        console.log(data);
  console.log(data.registration, data.userName, data.password, data.address, data.email);
       db.collection("UserDetails").insertOne({ "registrationNumber": data.registration}, function(err, result) {
            if (err) throw err;
            if (res) {
                db.collection("UserDetails").insertOne({
                    "user": {
                        "userName": data.userName,
                        "registrationNumber": data.registration,
                        "password": data.password,
                        "address": data.address,
                        "email": data.email
                    }
                }, function(err, result) {
                    if (err) throw err;
                    if (result) {
                    	console.log(result);
                        var sendMail = {
                            from: 'mythili1866@gmail.com',
                            to: data.email,
                            subject: 'Medical Insights-Registration',
                            html: '<h1>Welcome to Medical Insights</h1><p>Please login to continue your access to the website</p><p>Thanks <br/> -Medical Insights</p>'
                        };


                        transporter.sendMail(sendMail, function(error, info) {
                            if (error) {
                                
                            
                                db.collection("UserDetails").deleteOne({
                                    "user": {
                                        "userName": data.userName,
                                        "password": data.password,
                                        "address": data.address,
                                        "email": data.email
                                    }
                                }, function(err, resp) {
                                    if (err) throw err;
                                    if (resp) {
                                        db.collection("UserDetails").deleteOne({ "registrationNumber": data.registration }, function(err, results) {
                                            if (err) throw err;
                                        })
                                    }
                                })
                                res.send("please provide valid email address");
                                res.end();

                            } else {
                                console.log('Email sent');
                                 res.send("you have got successfully registered a email is sent for your reference");
                        res.end();
                            }
                        });

                       


                    }

                })
            }

        })

    })

    

})

app.listen(4000, function() {
    console.log("Server running on 4000");

})