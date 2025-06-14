const user = require('../models/user');
const user = require('../models/user');
const User = require('../models/user');


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
        let user = await User.create(temp);

        return res.status(201).json(user);
    } catch (error) {
        return res.status(501).json(error);
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