// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// ----------- AUXILIARY FUNCTION ---------- //
// source: https://stackoverflow.com/a/44198641
function isValidDate(date) {
  return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}

// --------- API ENDPOINT /api/ ------- //
app.get("/api/", (req, res) => {
  res.json({
    unix : Date.now(),
    utc : new Date(Date.now()).toUTCString()
  })
});

// --------- API ENDPOINT /api/:date ------- //
app.get("/api/:date", (req, res, next) => {
  const d = req.params.date,
        isDate = isValidDate(new Date(d)),
        isNumber = !isNaN(Number(d));

  if (isDate) {
    const date = new Date(d);
    req.unix = Number(date);
    req.utc = date.toUTCString();
  }
  else if (isNumber){
    const number = Number(d);
    req.unix = number;
    req.utc = new Date(number).toUTCString();
  }
  else
    req.error = "Invalid Date";
  
  next();
}, (req, res) => {
  if(req.error !== undefined)
    res.json({ error: req.error });
  else
    res.json({
      unix : req.unix,
      utc : req.utc
    });
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
