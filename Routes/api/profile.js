const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Profile model
const Profile = require('../../models/Profile');

//LoaD USER 

const user = require('../../models/User');

//@route   GET api/profile/test
//@desc    Tests Profile routes
//@acess   Public
router.get('/test', (request, response) => {
    response.json({
        msg: "Profile Test passed"
    });
});


//@route   GET api/profile
//@desc    Get current user ID
//@acess   Private

router.get('/', passport.authenticate('jwt', {
    session: false
}), (request, response) => {
    const errors = {}
    Profile.findOne({
        user: request.user.id
    }).then(profile => {
        if (!profile) {
            errors.noprofile = "There is np profile for this user"
            response.status(404).send(errors)
        }

        response.send(200).send(profile);
    }).catch(x => {
        response.status(x);
    })
});


//@route   POST api/profile
//@desc    Create / Update  user ID
//@acess   Private

router.post('/', passport.authenticate('jwt', {
    session: false
}), (request, response) => {
    const errors = {}

    const profileFields = {};
    profileFields.user = request.user.id;
    if (request.body.handle) profileFields.handle = request.body.handle;
    if (request.body.company) profileFields.company = request.body.company;
    if (request.body.website) profileFields.website = request.body.website;
    if (request.body.location) profileFields.location = request.body.location;
    if (request.body.bio) profileFields.bio = request.body.bio;
    if (request.body.status) profileFields.status = request.body.status;
    if (request.body.githubusername) profileFields.githubusername = request.body.githubusername;

    //SPLIT INTO ARRAYS
    if (typeof request.body.skills !== 'undefined') {
        profileFields.skills = request.body.skills.split(',');
    }

    profileFields.social = {};

    if (request.body.youtube) profileFields.social.youtube = request.body.youtube;
    if (request.body.twitter) profileFields.social.twitter = request.body.twitter;
    if (request.body.linkedin) profileFields.social.linkedin = request.body.linkedin;
    if (request.body.facebook) profileFields.social.facebook = request.body.facebook;
    if (request.body.instagram) profileFields.social.instagram = request.body.instagram;

    Profile.findOne({
        user: request.user.id
    }).then(profile => {
        if (profile) {
            //Update
            Profile.findByIdAndUpdate({
                user: request.user.id
            }, {
                $set: profileFields
            }, {
                new: true
            }).then(profile => {
                response.json(profile);
            })
        } else {
            //Create
            //Check if handle exists
            Profile.findOne({
                handle: profileFields.handle
            }).then(profile => {
                if (profile) {
                    errors.handle = "Handle Already exists"
                    response.status(400).json(errors)
                }

                //Save Profirl
                new Profile(profileFields).save().then(profile => {
                    response.status(200).json(profile);
                })
            })
        }
    })
});


module.exports = router;