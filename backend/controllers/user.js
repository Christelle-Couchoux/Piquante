const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// create new user
exports.signup = (req, res, next) => {
    // hash password
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        // mask email address

        // create new user
        const user = new User({
            email: req.body.email, //change with masked email address
            password: hash
        });
        user.save() // save new user in database
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error })); // code 500 for server error
};

// connect existing user
exports.login = (req, res, next) => {

};