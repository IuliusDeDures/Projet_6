const Sauce = require("../models/sauce");
const fs = require("fs");

// route pour  créer une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
        likes: 0,
        dislikes: 0,
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
};

// route pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    const sauceId = req.params.id;
    Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
            if (sauce.userId == req.auth.userId) {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: sauceId })
                        .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
                        .catch((error) => res.status(403).json({ error }));
                });
            } else {
                res.status(401).json({
                    error: "Utilisateur non valide !"
                });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

// route pour afficher l'ensemble des sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

// route pour afficher une sauce
exports.getOneSauce = (req, res, next) => {
    const sauceId = req.params.id;
    Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
            res.status(200).json(sauce);
        })

    .catch((error) => res.status(404).json({ error }));
};

// route pour modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceId = req.params.id;
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
    } : {...req.body };
    Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
            if (sauce.userId == req.auth.userId) {
                Sauce.updateOne({ _id: sauceId }, {...sauceObject, _id: sauceId })
                    .then(() => res.status(200).json({ message: "Sauce modifié !" }))
                    .catch((error) => res.status(403).json({ error }));
            } else {
                res.status(403).json({
                    error: "Utilisateur non valide !"
                });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

// route pour liker ou disliker une sauce
exports.likeSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;
    Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
            switch (like) {
                case 1:
                    if (!sauce.usersLiked.includes(userId) && like == 1) {
                        Sauce.updateOne({ _id: sauceId }, { $inc: { likes: 1 }, $push: { usersLiked: userId } })
                            .then(() => res.status(201).json({ message: "Sauce liké !" }))
                            .catch((error) => res.status(400).json({ error }));
                    }
                    break;
                case -1:
                    if (!sauce.usersDisliked.includes(userId) && like == -1) {
                        Sauce.updateOne({ _id: sauceId }, { $inc: { dislikes: 1 }, $push: { usersDisliked: userId } })
                            .then(() => res.status(201).json({ message: "Sauce disliké !" }))
                            .catch((error) => res.status(400).json({ error }));
                    }
                    break;
                case 0:
                    if (sauce.usersLiked.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId }, { $inc: { likes: -1 }, $pull: { usersLiked: userId } })
                            .then(() =>
                                res.status(201).json({ message: "Sauce n'est plus liké !" })
                            )
                            .catch((error) => res.status(400).json({ error }));
                    }
                    if (sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } })
                            .then(() =>
                                res.status(201).json({ message: "Sauce n'est plus disliké !" })
                            )
                            .catch((error) => res.status(400).json({ error }));
                    }
                    break;
            }
        })
        .catch((error) => res.status(404).json({ error }));
};