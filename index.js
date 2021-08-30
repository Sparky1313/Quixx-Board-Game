const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));

app.get('/qwixx', (req, res) => {
	res.render('quixx')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));