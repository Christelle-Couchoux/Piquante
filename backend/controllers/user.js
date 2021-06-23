const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// create new user
exports.signup = (req, res, next) => {
    // hash password
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // create new user
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // save new user in database
            user.save() 
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// connect existing user
exports.login = (req, res, next) => {
    // search in database for user with email address that matches
    User.findOne({ email: req.body.email })
        .then(user => {
            // if user not found in database
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // if user found
            // compare hashes to check if they come from the same string (password)
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // if they don't match
                    if(!valid) {
                        return res.staus(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // if they match
                    res.status(200).json({
                        // return user id
                        userId: user._id, // unique user id created by MongoDB
                        // return token
                        token: jwt.sign(
                            { userId: user._id }, // data to encrypt
                            'RANDOM_TOKEN_SECRET', // change to more complex key for implementation
                            { expiresIn: '24h' } 
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
