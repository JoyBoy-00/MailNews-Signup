const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function (req, res) {
    const firstName = req.body.FirstName;
    const secondName = req.body.SecondName;
    const email = req.body.Email;
    console.log(firstName + " " + secondName + " " + email);

    const memberdata = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: secondName
            }
        }]
    };
    const jsonData = JSON.stringify(memberdata);

    const url = "https://us21.api.mailchimp.com/3.0/lists/1dffb9ee2d";
    const options = {
        method: "POST",
        auth: "Viv:1659d24b21e02c045375c5ced037ff80-us21"
    };
    const request = https.request(url, options, function (response) {

        response.on("data", function (data) {
            console.log(JSON.parse(data));
            if(JSON.parse(data).error_count!=0){
                if(JSON.parse(data).errors[0].error_code == "ERROR_GENERIC")
                res.sendFile(__dirname+"/valid_email.html");
                else if(JSON.parse(data).errors[0].error_code == "ERROR_CONTACT_EXISTS")
                res.sendFile(__dirname+"/Already_exists.html");
                else
                res.sendFile(__dirname+"/failed.html");
            }
            else if(JSON.parse(data).error_count == 0 && response.statusCode == 200)
            res.sendFile(__dirname+"/success.html");
            else
            res.sendFile(__dirname+"/failed.html");
        })

        // if(response.statusCode === 200)
        // res.sendFile(__dirname+"/success.html");
        // else
        // res.sendFile(__dirname+"/failed.html");
    })
    request.write(jsonData);
    request.end();

})

app.post("/failure", function (req,res) {
    res.redirect("/");
  })
  app.post("/success", function(req,res){
    res.redirect("/");
  })


app.listen(process.env.PORT || 3000, function () {
    console.log("Hello World Working on port 3000");
})



//

// 