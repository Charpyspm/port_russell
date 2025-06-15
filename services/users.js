const User = require('../models/user');
const SECRET_KEY = process.env.SECRET_KEY;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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


    const temp = ({
        username: req.body.userName,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const { username, email, password} = req.body;
        const hash = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hash });
        await user.save();
        return res.status(201).json({ message: 'User created'});
    } catch (error) {
        return res.status(501).json({ error: error.message});
    }
};

//callback pour mettre à jour un utilisateur 

exports.update = async (req, res, next) => {
    const id = req.params.id;
    const temp = ({
        username: req.body.userName,
        email: req.body.email,
        password: req.body.password
    });

    try {
        let user = await user.findOne ({_id: id});

        if (user) {
            Object.keys(temp).forEach((key) => {
                if (temp[key]) {
                    user[key] = temp[key];
                }
            });

            await user.save();
            return res.status(201).json(user);

        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        res.status(501).json(error);
    }
}

//callback pour supprimer un utilisateur
exports.delete = async (req, res, next) => {
    const id = req.params.id;

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

    try {
        let user = await User.findOne({ email: email }, '-__v -createdAt -updatedAt');

        if (user) {
            bcrypt.compare(password, user.password, function(err, responce) {
                if (err) {
                    throw new Error(err);
                }
                if (responce) {
                    delete user._doc.password;

                    const expireIn = 60 * 60 * 24;
                    const token = jwt.sign({
                        user: user
                    },
                    SECRET_KEY,
                    {
                        expiresIn: expireIn
                    });

                    res.header('Authorization', 'Bearer' + token);

                    return res.status(200).json({token});
                }

                return res.status(403).json('wrong_credentials');
            });
        } else {
            return res.status(404).json('user_not_found');
        }
    } catch (error) {
        return res.status(501).json(error);
    }
}