const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.checkJWT = async (req, res, next) => {
    console.log('Checking JWT token...', req.method, req.originalUrl);
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!!token && token.startsWith('Bearer')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json('token_not_valid');
            } else {
                req.decoded = decoded;

                const expiresIn = 60 * 60 * 24;
                const newToken = jwt.sign({
                    user : decoded.user
                },
                SECRET_KEY,
                {
                    expiresIn: expiresIn
                });

                res.header('Authorization', 'Bearer ' + newToken);
                next();
            }
        });
    } else {
        return res.status(401).json('token_required');
    }
}