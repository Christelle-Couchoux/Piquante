const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

const app = express();

// connect to MongoDB
//change db name
mongoose.connect('mongodb+srv://xxxx',
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// define headers to avoid CORS errors
app.use((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // origin allowed = all
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // headers allowed
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // methods allowed
    next();
});

// convert request body to js so can de used
app.use(bodyParser.json());

// give access to static directory images
app.use('/images', express.static(path.join(__dirname, 'images')));

// define routers
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;