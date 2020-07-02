const { verifyJwt } = require("../helpers/jwt");

const checkJtw = (req, res, next) => {

    let token = req.headers['authorization'];
    token = token ? token.slice(7, token.length) : null;

    if (!token) return res.jsonUnauthorized(null, 'Invalid Token');

    try {
        const decoded = verifyJwt(token);
        req.accountId = decoded.id;
    } catch (error) {
        return res.jsonUnauthorized(null, 'Invalid Token');
    }


    next();
};

module.exports = checkJtw;