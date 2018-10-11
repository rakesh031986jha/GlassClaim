var request=require('request');
var express = require('express'),
  app = express(),
  http = require('http'),
  httpServer = http.Server(app),
  
  session = require('express-session');
const crypto = require('crypto');
var router = express.Router();
var config = require("./config"); 
//var config=('src/setting.js')

console.log(config.accessToken);

var bodyParser = require('body-parser');
var fs = require('fs');
const requestAPI = require('request');
app.use(bodyParser.json());
app.use(session({
  secret: 'login',
  key: 'opty'
}));
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

app.post("/webhook",async (req,res)=>{
  var options = {
    url: config.chatServerURL,
    method: "POST",
    headers: { 'Authorization': 'Bearer ' + config.accessToken, 'Content-Type': 'application/json'},
    body: req.body,
    json: true
  };
  await requestAPI(options, function (error, response, body) {
  console.log('1------------',body);
  
     if(!error){
      
      if(body.result.action=='input.discount'){
      
        body.result.fulfillment.messages[2].speech = '<a class="pdfClass" data-toggle="modal" data-target="#fundModal">Click here</a> to refer the discount chart for more details'
         res.send(body);
        }else if(body.result.action =="riskClass"){
          let riskClass = body.result.parameters && body.result.parameters.RiskClass ? body.result.parameters.RiskClass : null;
          res.send(body);
        }
        else {
          res.send(body);
        }
     } 
  // 
      
  
  });
})

var jsonIncompleteTran = [];

app.get('/', function (req, res) {
  res.send("/richowebsites");
});


app.get('/chatwindow', function (req, res) {
  readFile("IncompleteTransaction.json", function (hasFile, data) {
    if (hasFile) {
      jsonIncompleteTran = data;
    }
    res.sendfile(__dirname + '/chatwindow1.html');
  });
});

app.get('/chat', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});




app.listen(process.env.PORT || 9000);





   
