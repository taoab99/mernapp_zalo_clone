const jwt = require('jsonwebtoken');
const Users = require('../Modles/User');

// require('dotenv').config();

const veryfitoken = async (req, res, next) => {
    const authenHeader = req.header('Authorization');
    const token = authenHeader && authenHeader.split(' ')[1];
    if (!token) return res.status(500).json({ message: "token không đúng" });
    try {
        const infoToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const { id, email } = infoToken;
        const user = await Users.findOne({ _id: id, email });
        if (user) {
            req.id = user._id;
            req.name = user.name;
            next();
        }

    } catch (error) {
        res.status(401).json({
            message: "token not isvalid"
        })
    }
};

module.exports = veryfitoken;