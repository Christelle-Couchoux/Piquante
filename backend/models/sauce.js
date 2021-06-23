const mongoose = require('mongoose');

// @ts-ignore
const validate = require('mongoose-validator');

// @ts-ignore
const sanitize= require('mongoose-sanitizer-plugin');


// define constraints (define length, exclude special characters)
const nameValidator = [
    validate({
      validator: 'isLength',
      arguments: [3, 50],
      message: 'Le nom de la sauce doit comprendre entre 3 et 50 caractères.',
    }),
    validate({
      validator: 'matches',
      arguments: /^[-\w\sÀÁÂÄÅÇÈÉÊËÌÍÎÏÑŒÒÓÔÕÖØÙÚÛÜàáâäåçèéêëìíîïñœòóôõöøùúûü]+$/,
      message: 'Le nom de la sauce ne doit pas comprendre de caractères spéciaux.',
    }),
]

const manufacturerValidator = [
    validate({
      validator: 'isLength',
      arguments: [3, 30],
      message: 'Le nom du fabriquant doit comprendre entre 3 et 30 caractères.',
    }),
    validate({
      validator: 'matches',
      arguments: /^[-\w\sÀÁÂÄÅÇÈÉÊËÌÍÎÏÑŒÒÓÔÕÖØÙÚÛÜàáâäåçèéêëìíîïñœòóôõöøùúûü]+$/,
      message: 'Le nom du fabriquant ne doit pas comprendre de caractères spéciaux.',
    }),
]

const descriptionValidator = [
    validate({
      validator: 'isLength',
      arguments: [3, 200],
      message: 'La description doit comprendre entre 3 et 200 caractères.',
    }),
    validate({
      validator: 'matches',
      arguments: /^[-\w\sÀÁÂÄÅÇÈÉÊËÌÍÎÏÑŒÒÓÔÕÖØÙÚÛÜàáâäåçèéêëìíîïñœòóôõöøùúûü]+$/,
      message: 'La description ne doit pas comprendre de caractères spéciaux.',
    }),
]

const pepperValidator = [
    validate({
      validator: 'isLength',
      arguments: [3, 30],
      message: 'Le principal ingrédient doit comprendre entre 3 et 30 caractères.',
    }),
    validate({
      validator: 'matches',
      arguments: /^[-\w\sÀÁÂÄÅÇÈÉÊËÌÍÎÏÑŒÒÓÔÕÖØÙÚÛÜàáâäåçèéêëìíîïñœòóôõöøùúûü]+$/,
      message: 'Le principal ingrédient ne doit pas comprendre de caractères spéciaux.',
    }),
]

/* 
frontend should be updated to reflect that sauce informations need to be valid

- add instructions to new sauce form
for each field :
    length required
    symbols are not allowed

- display an alert message if data entered is not valid
*/


// create schema for sauces
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true, validate: nameValidator },
    manufacturer: { type: String, required: true, validate: manufacturerValidator },
    description: { type: String, required: true, validate: descriptionValidator },
    mainPepper: { type: String, required: true, validate: pepperValidator },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] }, 
});

// sanitize data
sauceSchema.plugin(sanitize);

module.exports = mongoose.model('Sauce', sauceSchema);
