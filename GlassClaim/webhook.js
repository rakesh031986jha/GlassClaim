var request=require('request');
var express = require('express'),
  app = express(),
  http = require('http'),
  httpServer = http.Server(app),
  
  session = require('express-session');
const crypto = require('crypto');
var router = express.Router();
// Moment JS




var bodyParser = require('body-parser');
var fs = require('fs');
const requestAPI = require('request');
app.use(bodyParser.json());
app.use(session({
  secret: 'login',
  key: 'opty'
}));
app.use(express.static(__dirname));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

app.post("/webhook",async (req,res)=>{
  var options = {
    url: "https://api.dialogflow.com/v1/query?v=20150910",
    method: "POST",
    headers: { 'Authorization': 'Bearer ' + '2a7a1ea959934ecb94773d5a63969912', 'Content-Type': 'application/json'},
    body: req.body,
    json: true
  };
  await requestAPI(options, function (error, response, body) {
  console.log('1------------',body);
   if (body.result.action=='input.GlassSize')
   {
    CreateClaim(req,res);
     } else {
  //    console.log('last------------',body);
            res.send(body);
     }
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
app.get('/roaming', function (req, res) {
  readFile("IncompleteTransaction.json", function (hasFile, data) {
    if (hasFile) {
      jsonIncompleteTran = data;
    }
    res.sendfile(__dirname + '/roaming.html');
  });
});
app.get('/chat', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


app.post('/claimCreate',function (req, res){
      
})

function CreateClaim(req,res)
{
  //console.log('inside create claim------------',req);
  var options = { method: 'POST',
     
  url: 'http://35.154.116.87:8080/cc/service/edge/fnol/cfnol',

  headers:

   { 'postman-token': 'ff149a5b-daaf-0000-0b8c-5301c162be75',

     'cache-control': 'no-cache',

     authorization: 'Basic c3U6Z3c=',

     accept: 'application/json',

     'content-type': 'application/json' },

  body:

   { jsonrpc: '2.0',

     method: 'createClaimForHomeOwners',

     params:

      [ { lossDate: '2018-09-27T00:00:00Z',

          lossType: 'PR',

          lossCause: 'glassbreakage',

          description: 'windowcrashed' } ] },

  json: true };

 

request(options, function (error, response, body) {
  console.log('2------------',body);
  if (error) throw new Error(error);
console.log("Rakesh jha");
  var claimno = body.result;
  console.log(claimno);
  
  console.log('3------------',claimno);
          return res.json({"fulfillment": {
            "speech": "",
            "messages": [
              {
                "type": 0,
                "platform": "facebook",
                "speech": "Your Claim Number"+claimno
              },
              {
                "type": 0,
                "speech": ""
              }
            ]
          }});
        

});

}




app.listen(process.env.PORT || 9000);





   