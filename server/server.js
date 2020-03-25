const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const rp = require('request-promise');
const exec = require('child_process').exec;

const glitchup = require('glitchup');
glitchup();


var app = express();
// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({ origin: '*' }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

if (!process.env.APP_KEY) {
  console.error('WARNING: don\'t forget to set the APP_KEY environment variable, for Trello API.');
}

Promise = require('bluebird');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// compress our client side content before sending it over the wire
app.use(compression());

app.use(express.static('node_modules'));

// Setup server routes
require('./routes.js')(app);

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Server up and running on port ${process.env.PORT} 🏃`);
});
