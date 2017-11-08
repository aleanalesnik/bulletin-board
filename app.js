// CONFIG
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'));



// REQUIRING POSTGRES
const { Client } = require('pg')
const client = new Client({
    database: 'bulletinboard',
    host: 'localhost',
    user: process.env.POSTGRES_USER
})



// CONNECTION STRING
var connectionString = ('postgres://process.env.POSTGRES_USER@localhost:3000/bulletinboard');




client.connect();


// FUNCTION TO ALLOW APPOSTROPHES IN MESSAGES
function replaceAppos(str) {
	return str.replace(/\'/g, "''")
}




//ROUTES

// GET - HOME PAGE
app.get('/', function(req, res) {
    res.render('index');
});


// POST - INSERT MESSAGE VALUES INTO MESSAGES TABLE 
app.post('/success', (req, res) => {

    let newMessage = {
        title: replaceAppos(req.body.title),
        body: replaceAppos(req.body.body)
    };

    client.query(`insert into messages (title, body) values('${newMessage.title}', '${newMessage.body}')`, (err) => {
        if (err) {
            console.error(err.stack);
        }
        console.log('Message added')
        res.redirect('success');
    })

});


// GET - SUCCESS PAGE
app.get('/success', function(req, res) {
    res.render('success');
});


// GET - MESSAGES PAGE 
app.get("/messages", (request, response) => {
    client.query('select * from messages', (err, res) => {
        console.log(err ? err.stack : res.rows)
        var results = res.rows;
        response.render('messages', {messageResults: results});
    })
});



// GET - ABOUT PAGE
app.get("/about", (req, res) => {
    res.render("about");
});



// PORT
app.listen(3000, function(res) {
    console.log("App listening on port 3000!");
})