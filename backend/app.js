const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const cookieSession = require('cookie-session');
const nocache = require('nocache');

require('dotenv').config();

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const app = express();

// connect to MongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// define headers to avoid CORS errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // origin allowed = all
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, '); // headers allowed
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // methods allowed
    next();
});

// secure cookies
app.use(cookieSession({
  keys: [process.env.COOKIE_KEY1, process.env.COOKIE_KEY2],
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'http://localhost:3000',
    maxAge: 60 * 60 * 1000 // 1 hour in ms
  }
}));

// convert request body to js so can be used
app.use(bodyParser.json());

// secure headers, 11 middlewares
app.use(helmet());

// disable caching
app.use(nocache());

// give access to static directory images
app.use('/images', express.static(path.join(__dirname, 'images')));

// define routers
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
