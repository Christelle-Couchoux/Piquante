// require strong password to signup

const passwordSchema = require('../models/password');

// verify that the password matches the password schema
module.exports = (req, res, next) => {
    // if password not strong enough
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({ message: 'Mot de passe pas assez fort. Mot de passe requiert : au moins 8 caractères, au moins 1 majuscule, au moins 1 minuscule, au moins 1 chiffre, au moins 1 caractère spécial. Les espaces ne sont pas autorisés.'})
    } else {
        next(); // if password ok, move to next middleware
    }
};

/* 
frontend should be updated to reflect that a strong password is required

- add instructions to signup form
    password requires:
        at least 8 characters
        at least 1 uppercase letter
        at least 1 lowercase letter
        at least 1 digit
        at least 1 symbol
        spaces are not allowed

- display an alert message if password is not valid
*/
