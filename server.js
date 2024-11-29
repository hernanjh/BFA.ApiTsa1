const bodyParser = require('body-parser')
const express = require("express")
const app = express()
const port = process.env.PORT || 3030;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(require('./api/routes'));


app.listen(port, () => console.log("Start Server (Port " + port + ")....OK"));
