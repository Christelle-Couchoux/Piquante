const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

// @ts-ignore
const sanitize= require('mongoose-sanitizer-plugin');

// create schema for users
const userSchema = mongoose.Schema({
    email: {
        type: String, 
        required: true, 
        unique: true, 
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Veuillez saisir une adresse email valide."]
    },
    password: { 
        type: String, 
        required: true
    }
});

// require unique email address
userSchema.plugin(uniqueValidator);

// sanitize data
userSchema.plugin(sanitize);

module.exports = mongoose.model('User', userSchema);
