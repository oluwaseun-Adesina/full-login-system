const express = require('express');
const router = express.Router();
const User = require('../models/User');

//signup
router.post('/signup', (req, res) => {
    let { name, email, password, dateofbirth } = req.body;
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
                    // Create salt & hash
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    jwt.sign(
                                        { id: user.id },
                                        process.env.jwtSecret,
                                        { expiresIn: 3600 },
                                        (err, token) => {
                                            if (err) throw err;
                                            res.json({
                                                token,
                                                user: {
                                                    id: user.id,
                                                    name: user.name,
                                                    email: user.email
                                                }
                                            });
                                        }
                                    );
                                });
                        });
                    });
                }
            }).catch(err => {
                res.status(400).json({ 
                    status: 'error',
                    message: 'Error occured While checking if user exists' 
                });
            });
    }
});

//login 
router.post('/login', (req, res) => {
    res.send('login');
});

module.exports = router;