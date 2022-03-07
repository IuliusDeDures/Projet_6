const passwordValidator = require('password-validator');

// création du schéma du pour le mot de passe
const schemaPasseword = new passwordValidator();

schemaPasseword
    .is().min(5)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces()

// vérification de la conformité du mot de passe

module.exports = (req, res, next) => {
    if (schemaPasseword.validate(req.body.password)) {
        next();

    } else {
        return res
            .status(400).json({ error: 'Le mot de passe doit contenir au minimum 5 caractères (au moins 1 minuscule, 1 majuscule, 1 chiffre) !' })
    }
}