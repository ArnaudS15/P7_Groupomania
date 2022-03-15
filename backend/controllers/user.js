const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const fs = require('fs');
const User = require('../models/User');
const Moderator = require('../models/Moderator');


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash =>{
            User.create({
                    email: req.body.email,
                    password: hash,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname, })
                .then(()=> res.status(201).json({message: 'Utilisateur créé !'}))
                .catch((error)=> res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {

    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if(user === null){
            return res.status(401).json({error: 'Utilisateur ou mot de passe incorrect !'});
        }
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid){
                    let message = `Mot de passe incorrect !`; 
                    return res.status(401).json({error: message});
                }
                res.status(200).json({
                    userId: user.id_user,
                    token: jwt.sign( //fonction de Jsonwebtoken
                        {userId: user.id_user}, // données a encoder
                        config.JWT_TOKEN , //clé d'encodage
                        {expiresIn: '3h'} // expiration du token
                    )
                }); 
            })
            .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

exports.getUser = (req, res, next) => {
    User.findOne({
            attributes: { 
                exclude: ['email', 'password']
            },
            where: {
                id_user: req.params.id_user
            }
        })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(400).json({error}));
};

exports.modifyUser = (req, res, next) => {
    if(req.file){ //si on reçois un fichier, on verifie l'existence d'un précédent et on le supprime
        User.findByPk(req.params.id_user) 
            .then(user => {
                if(user.avatar){
                    const filename = user.avatar.split('/images/avatars/')[1];
                    fs.unlink(`images/avatars/${filename}`, () => {console.log('Fichier image supprimé')});
                }
            })
            .catch(error => res.status(400).json({error}));
    };

    const user = req.file ? {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        avatar: `${req.protocol}://${req.get('host')}/images/avatars/${req.file.filename}`
    } : {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    };

    User.update(user,
        {
            where: {
                id_user: req.params.id_user
            }
        })
        .then(()=> res.status(200).json({message : 'Compte utilisateur modifié !'}))
        .catch((error)=> res.status(500).json({error}));
};

exports.deleteUser = (req, res, next) => {
    User.findByPk(req.params.id_user) 
        .then(user => {
            if(user.avatar){
                const filename = user.avatar.split('/images/avatars/')[1];
                fs.unlink(`images/avatars/${filename}`, () => {console.log('Fichier image supprimé')});
            }

            User.destroy({ 
                where: {
                    id_user: req.params.id_user
                }
            })
                .then(()=> res.status(200).json({message : 'Compte utilisateur supprimé !'}))
                .catch((error)=> res.status(500).json({error}));
        })
        .catch(error => res.status(400).json({error}));
};

exports.getModerator = (req, res, next) => {
    Moderator.findOne({
            where: {
                id_user: req.params.id_user
            }
        })
        .then(moderator => {
            if(moderator){
                res.status(200).json({moderator : true});
            }
            else res.status(200).json({moderator : false});
        })
        .catch(error => res.status(400).json({error}));
};