const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');


//Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLogInInput = require('../../validation/login');

//Load User Model
const User = require('../../models/User');


//@route   GET api/profile/test
//@desc    Tests profile routes
//@acess   Public
router.get('/test', (request, response) => {
    response.json({
        msg: "User Test passed"
    });
});


//@route   POST api/users/register
//@desc    Register User
//@acess   Public

router.post('/register', (request, response) => {
    const {
        errors,
        isvalid
    } = validateRegisterInput(request.body);

    if (!isvalid) {
        return response.status(400).json(errors)
    }
    const {
        email,
        name,
        password
    } = request.body
    User.findOne({
        email: email
    }).then(user => {
        if (user) {
            return response.status(400).json({
                email: "Email Already exists"
            });
        } else {
            const avatar = gravatar.url(email, {
                s: 200, //SIZE 
                r: 'pg', //RATING
                d: 'mm'
            })
            const newUser = new User({
                name: name,
                email: email,
                password: password,
                avatar,
                avatar
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hashp) => {
                    if (err) throw err;
                    newUser.password = hashp,
                        newUser.save()
                        .then(user => {
                            response.json(user);
                        })
                        .catch(erro => {
                            console.log("Error OCcurred with Sig:", erro);
                        });
                })
            })
        }
    })
});


//@route   POST api/users/login
//@desc    Login User
//@acess   Public

router.post('/login', (request, response) => {

    const {
        errors,
        isvalid
    } = validateLogInInput(request.body);

    if (!isvalid) {
        return response.status(400).json(errors)
    }

    const {
        email,
        password
    } = request.body;

    //Find User By EMail

    User.findOne({
        email
    }).then(user => {
        if (!user) {
            errors.email = 'User Not Found'
            return response.status(404).json(errors);
        }

        //Check Password

        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                //USER MATCHED
                const payload = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                }
                jwt.sign(payload, keys.secretOrKey, {
                    expiresIn: 3600
                }, (err, token) => {
                    response.json({
                        success: true,
                        token: 'Bearer ' + token
                    })
                });
            } else {
                errors.password = "Incorrect Password"
                response.status(400).json(errors);
            }
        })
    })
});


//@route   POST api/users/current
//@desc    Return current USer
//@acess   Private

router.get('/current', passport.authenticate('jwt', {
    session: false
}), (request, response) => {
    const {
        id,
        email,
        name
    } = request.user
    response.json({
        msg: {
            id,
            email,
            name
        }
    });
})

module.exports = router;