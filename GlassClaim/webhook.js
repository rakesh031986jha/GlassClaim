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
  //     priceConverter(req,res)
      } else {
      
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

var lossDate;
var lossType;
var lossCause;
var description

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
          return res.json({"result":{"fulfillment": {
            "speech": "",
            "messages": [
              {
                "type": 0,
                "platform": "facebook",
                "speech": "Your Claim number is "+claimno
              },
              {
                "type": 0,
                "speech": ""
              }
            ]
          }}});
      
});

}

function priceConverter(req,res){
  var options = { method: 'POST',
  url: 'http://35.154.116.87:7999/aa/getMockGlassCost',
  headers: 
   { 'postman-token': '225193bc-ade0-bb34-6a7e-b6e8851b7c3b',
     'cache-control': 'no-cache',
     'content-type': 'application/json' },
  body: 
   { height: 70,
     width: 30,
     thickness: 33,
     glassType: 'Safety Laminated Glass',
     windowType: 'Double Hung Windows' },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  var price = body.result;
  console.log(body.result);
  
  console.log('price 3------------',price);
          return res.json({"result":{"fulfillment": {
            "speech": "",
            "messages": [
              {
                "type": 0,
                "platform": "facebook",
                "speech": "Based on the quotes received from the market, you are entitled to a claims payment of USD "+ price +"."+
                           "We've added an additional 10% to the market rates to cover any additional expenses that you may incur "
              },
              {
                "type": 0,
                "speech": ""
              }
            ]
          }}});

  
});

}



app.listen(process.env.PORT || 9000);





   