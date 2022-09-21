const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//signup
router.post('/signup', (req, res) => {
    let { name, email, password, dateofbirth } = req.body;
    console.log(req.body);
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateofbirth = dateofbirth.trim();
    if (!name || !email || !password || !dateofbirth) {
        return res.status(400).json({
            status: 'error',
            message: 'Please enter all fields'
        });
    } else if (!/^[a-zA-Z ]+$/.test(name)) {
        return res.status(400).json({
            status: 'error',
            message: 'Please enter a valid name'
        });
    } else if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
        res.json({
            status: 'error',
            message: 'Please enter a valid email'
        });
    }

    else if (password.length < 8) {
        return res.status(400).json({
            status: 'error',
            message: 'Password must be at least 6 characters'
        });
    } else if (!new Date(dateofbirth).getTime()) {
        return res.status(400).json({
            status: 'error',
            message: 'Please enter a valid date of birth'
        });
    }

    else {
        User.findOne({ email })
            .then(user => {
                if (user) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'User already exists'
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password,
                        dateofbirth
                    });

                    const saltRounds = 10;
                    bcrypt.hash(password, saltRounds).then(hashedPassword => {
                        const newUser = new User({
                            name,
                            email,
                            password: hashedPassword,
                            dateofbirth
                        });
                        newUser.save()
                            .then(user => {
                                res.json({
                                    status: 'success',
                                    message: 'User created successfully',
                                    data: user
                                });
                            })
                            .catch(err => {
                                res.json({
                                    status: 'error',
                                    message: 'Error creating user',
                                    data: err
                                });
                            })

                            .catch(err => {
                                res.status(500).json({
                                    status: 'error',
                                    message: 'An error occurred hashing the password',
                                    data: err
                                });
                            });
                    });
                }
            })
            .catch(err => {
                res.status(500).json({
                    status: 'error',
                    message: 'An error occurred while checking for existing user',
                    data: err

                });
            });
    }
});


//login 
router.post('/login', (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();
    if (!email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Please enter all fields'
        });
    } else if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
        res.json({
            status: 'error',
            message: 'Please enter a valid email'
        });
    } else if (password.length < 8) {
        return res.status(400).json({
            status: 'error',
            message: 'Password must be at least 6 characters'
        });
    } else {
        User.findOne({ email })
            .then(user => {
                if (!user) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'User does not exist'
                    });
                } else {
                    bcrypt.compare(password, user.password)
                        .then(isMatch => {
                            if (!isMatch) {
                                return res.status(400).json({
                                    status: 'error',
                                    message: 'Invalid password'
                                });
                            } else {
                                res.json({
                                    status: 'success',
                                    message: 'Login successful',
                                    data: user
                                });
                            }
                        })
                        .catch(err => {
                            res.status(500).json({
                                status: 'error',
                                message: 'An error occurred while comparing passwords',
                                data: err
                            });
                        });
                }
            })
            .catch(err => {
                res.status(500).json({
                    status: 'error',
                    message: 'An error occurred while checking for existing user',
                    data: err
                });
            });
    }
});

module.exports = router;