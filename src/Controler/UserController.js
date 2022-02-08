const UserModles = require('../Modles/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

class UserController {
    async refeshToken(req, res) {
        const refeshToken = req.body.refeshToken;
        const refeshTokenVery = jwt.verify(refeshToken, process.env.REFESH_TOKEN_SECRET);
        if (refeshTokenVery) {
            const { email, id } = refeshTokenVery;
            const newToken = jwt.sign({ email: email, id: id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
            const newRefeshToken = jwt.sign({ email: email, id: id }, process.env.REFESH_TOKEN_SECRET);
            res.json({ token: newToken, refeshToken: newRefeshToken });
        }

    }
    async signup(req, res) {
        const { email, password, confirmPasword, useName, passPort } = req.body;
        try {
            const exitingUser = await UserModles.findOne({ email });
            if (exitingUser) return res.status(200).json({ message: "tài khoản đã được đăng ký" });
            if (password !== confirmPasword) return res.status(200).json({ message: "mật khẩu không trùng khớp" });

            const pas = parseInt(passPort);
            if (pas === 5555) {
                console.log(passPort);
                const hastPasword = await bcrypt.hash(password, 12);
                await UserModles.create({ email, pasword: hastPasword, name: useName });
                res.status(200).json({ success: true, message: "tạo tài khoản thành công kiểm tra email để biết thêm chi tiết" });
            } else {
                res.status(200).json({ success: false, message: "tạo tài khoản không thành công mã xác nhận không đúng" });
            }
        }
        catch (error) {
            console.log('lỗi', error)
            res.status(500).json({
                message: "đã xảy ra lỗi"
            })
        }
    }
    async checkmail(req, res) {
        const { email, password, confirmPasword, useName } = req.body;
        console.log('email', email, password, confirmPasword);
        try {
            const exitingUser = await UserModles.findOne({ email });
            if (exitingUser) return res.status(200).json(
                {
                    success: false,
                    message: "tài khoản đã được đăng ký"
                })
            else if (password !== confirmPasword) return res.status(200).json(
                {
                    success: false,
                    message: "mật khẩu không trùng khớp"
                });

            let testAccount = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAILNAME, // generated ethereal user
                    pass: process.env.EMAILPASSWORD, // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            const emailOptions = {
                from: '"TaoOcean35@gmail.com 👻" <foo@example.com>',
                to: email,
                subject: "Hello ✔",
                text: "Hello world?",
                html: `<h2>Hello ${email} !</h2>
                        <p>nhập mã <b>5555</b> để tạo tài khoản</p>`,
            }

            testAccount.sendMail(emailOptions, async (error, info) => {
                if (error) {
                    return res.status(400).json({ message: error });
                }
                else {
                    res.status(200).json(
                        {
                            success: true,
                            message: "mã kích hoạt được gửi tới email của bạn "
                        });
                }
            })
        } catch (error) {
            console.log('lỗi', error)
            res.status(500).json({
                message: "đã xảy ra lỗi"
            })
        }
    };

    async signin(req, res) {
        const { email, password, confirmPasword } = req.body;
        try {
            if (password !== confirmPasword) return res.status(400).json({ message: "mật khẩu không trùng khớp" });

            const exitingUser = await UserModles.findOne({ email });

            if (!exitingUser) return res.status(200).json({ message: "tài khoản không khớp" });

            const checkPasword = await bcrypt.compare(password, exitingUser.pasword);
            if (!checkPasword) return res.status(200).json({ message: "mật khẩu không đúng" });


            const token = jwt.sign({ email: exitingUser.email, id: exitingUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
            const refeshToken = jwt.sign({ email: exitingUser.email, id: exitingUser._id }, process.env.REFESH_TOKEN_SECRET);
            res.status(200).json({ use: { email: exitingUser.email, _id: exitingUser._id }, token, refeshToken, message: "đăng nhập thành công" });
        } catch (error) {
            res.status(500).json({ message: "đã xảy ra lỗi" });
        }
    };

    async getuser(req, res) {
        const getAll = await UserModles.find({});
        const users = getAll.map(user => {
            return { _id: user._id, name: user.name }
        })
        res.json({ data: users });
    }

};

module.exports = new UserController;