const Sauce = require('../models/sauce');
const fs = require('fs');

// display all sauces
exports.getAllSauces = (req, res, next) => {
    // get all the sauces
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// display one sauce
exports.getOneSauce = (req, res, next) => {
    // get sauce with specified id
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// add a new sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    // remove id generated by frontend
    delete sauceObject._id;
    // create instance of model Sauce
    const sauce = new Sauce({
        // get all data from the request body
        ...sauceObject,
        // create dynamic url for image, here format = http://localhost:3000/images/filename
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        // add like/dislike fields
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    // save new sauce in database
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ message: 'Les informations de sauce saisies ne sont pas valides !' }));
};

// modify a sauce (created by user)
exports.modifySauce = (req, res, next) => {
    // is there a file in the request?
    const sauceObject = req.file ?
      // if there is an image file
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body }; // if there is no image file
      // update sauce with specific id
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // ({object to modify}, {new object})
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({ error }));
};

// remove a sauce (created by user)
exports.deleteSauce = (req, res, next) => {
    // get sauce with specific id
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // from image url, split around folder name, get the second part = filename
            const filename = sauce.imageUrl.split('/images/')[1];
            // remove file
            fs.unlink(`images/${filename}`, () => {
                // remove sauce with specific id
                Sauce.deleteOne({ _id: req.params.id})
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// like/dislike a sauce
exports.likeOrDislike = (req, res, next) => {
    // get the sauce
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // if user likes the sauce
            if (req.body.like == 1) {
                // add userId to usersLiked array
                sauce.usersLiked.push(req.body.userId);
                Sauce.updateOne({ _id: req.params.id }, {
                    sauce,
                    usersLiked: sauce.usersLiked,
                    likes: sauce.usersLiked.length // update number of likes
                })
                    .then(() => res.status(200).json({ message: "Sauce likée !" }))
                    .catch(error => res.status(400).json({ error }));
            } else if (req.body.like == -1) { // if user dislikes the sauce
                // add userId to usersDisliked array
                sauce.usersDisliked.push(req.body.userId);
                Sauce.updateOne({ _id: req.params.id }, {
                    sauce,
                    usersDisliked: sauce.usersDisliked,
                    dislikes: sauce.usersDisliked.length // update number of dislikes
                })
                    .then(() => res.status(200).json({ message: "Sauce dislikée !" }))
                    .catch(error => res.status(400).json({ error }));
            } else if (req.body.like == 0) { // if user removes the vote
                // if user removes a like vote
                if (sauce.usersLiked.includes(req.body.userId)) {
                    // fin index of user in usersLiked array
                    let indexUserLiked = sauce.usersLiked.indexOf(req.body.userId);
                    // remove userId from usersLiked array
                    sauce.usersLiked.splice(indexUserLiked, 1);
                    Sauce.updateOne({ _id: req.params.id }, {
                        sauce,
                        usersLiked: sauce.usersLiked,
                        likes: sauce.usersLiked.length // update number of likes
                    })
                        .then(() => res.status(200).json({ message: "Like supprimé !" }))
                        .catch(error => res.status(400).json({ error }));
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    // fin index of user in usersDisliked array
                    let indexUserDisliked = sauce.usersDisliked.indexOf(req.body.userId);
                    // remove userId from usersDisliked array
                    sauce.usersDisliked.splice(indexUserDisliked, 1);
                    Sauce.updateOne({ _id: req.params.id }, {
                        sauce,
                        usersDisliked: sauce.usersDisliked,
                        dislikes: sauce.usersDisliked.length // update number of dislikes
                    })
                        .then(() => res.status(200).json({ message: "Dislike supprimé !" }))
                        .catch(error => res.status(400).json({ error }));
                }
            }
        })
        .catch(error => res.status(500).json({ error }));
};
