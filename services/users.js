const User = require('../models/user');
const SECRET_KEY = process.env.SECRET_KEY;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const service = require('../services/users')


//callback pour ajouter un utilisateur avec id
exports.getById = async (req, res, next) => {
    const id = req.params.id;

    try {
        let user = await User.findById(id);

        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404);json('user_not_found');
    }   catch (error) {
        return res.status(501).json(error);
    }

}


//callback pour ajouter un utilisateur

exports.add = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        console.log('Mot de passe recu:', password);
        const hash = await bcrypt.hash(password, 10);
        console.log('Hash générer:', hash);
        const user = new User({ username, email, password: hash });
        await user.save();
        return res.status(201).json({ message: 'User created' });
    } catch (error) {
        return res.status(501).json({ error: error.message });
    }
};

//callback pour mettre à jour un utilisateur 

exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const update = {};
        
        if (req.body.username) update.username = req.body.username;
        if (req.body.email) update.email = req.body.email;
        if (req.body.password) update.password = await bcrypt.hash(req.body.password, 10);

        const user = await User.findByIdAndUpdate(id, update, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'user_not_found' });
        }
        res.json(user);
    } catch (error) {
        res.status(501).json({ error: error.message });
    }
};

//callback pour supprimer un utilisateur
exports.deleteMe = async (req, res, next) => {
    const id = req.decoded.user._id;

    try {
        let user = await User.findByIdAndDelete(id);

        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
};

//callback pour authentifier un utilisateur
exports.authenticate = async (req, res, next) => {
    const { email, password } = req.body;

    console.log('Tentative de connexion:', { email, password });

    try {
        let user = await User.findOne({ email: email }, '-__v -createdAt -updatedAt');

        console.log('Utilisateur trouvé:', user);

        if (!user) {
            return res.status(404).json({ message: 'user_not_found' });
        }

        
        console.log('Hash en base:', user.password);

        const valid = await bcrypt.compare(password, user.password);

        console.log('Résultat bcrypt:', valid);

        if (!valid) {
            return res.status(403).json({ message: 'wrong_credentials' });
        }

        user = user.toObject();
        delete user.password;

        const expireIn = 60 * 60 * 24;
        const token = jwt.sign(
            { user: user },
            SECRET_KEY,
            { expiresIn: expireIn }
        );

        res.header('Authorization', 'Bearer ' + token);
        return res.status(200).json({ token });
    } catch (error) {

        console.log('Erreur attrapée:', error);

        return res.status(501).json({ error: error.message });
    }
}