const multer = require('multer');
const path = require('path');

const MIME_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']; //Tableau format MIME acceptés

const fileFilter = (req, file, callback) => { //Filtres pour n'accepter que les formats spécifiés plus haut
    if (MIME_TYPES.includes(file.mimetype)) { 
        callback(null, true);
    } else {
        return callback(new Error('Only images are allowed'), false);
    }
}

const storagePosts = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, 'images/posts') //Chemin de sauvegarde des images des posts
    },
    filename: (req, file, callback) => {
        const name = Date.now() + '_' + Math.floor(Math.random()*10000); //Définition du nom de fichier avec la date+nombre aleatoire
        const extension = path.extname(file.originalname);
        callback(null, name + extension);
    }
})

const storageAvatars = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, 'images/avatars') //Chemin de sauvegarde des avatars
    },
    filename: (req, file, callback) => {
        const name = Date.now() + '_' + Math.floor(Math.random()*10000); //Définition du nom de fichier avec la date+nombre aleatoire
        const extension = path.extname(file.originalname);
        callback(null, name + extension);
    }
})

exports.posts = multer({fileFilter, storage : storagePosts}).single('image');
exports.avatar = multer({fileFilter, storage : storageAvatars}).single('avatar');