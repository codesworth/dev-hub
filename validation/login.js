const validator = require('validator');
const isEmpty = require('../validation/is_empty')

module.exports = function validateProfileInput(data) {
    let errors = {}


    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';


    if (!validator.isLength(data.handle, {
            max: 40,
            min: 2
        })) {
        errors.handle = "Handle should be between 2 and 40 charatcers"
    }

    if (validator.isEmpty(data.handle)) {
        errors.handle = "Handle is required"
    }

    if (validator.isEmpty(data.status)) {
        errors.status = "Status is required"
    }

    if (validator.isEmpty(data.skills)) {
        errors.status = "Status is required"
    }



    if (!validator.isEmail(data.email)) {
        errors.email = 'Email is invalid'
    }

    if (validator.isEmpty(data.password)) {
        errors.password = 'Password is required'
    }

    if (validator.isEmpty(data.email)) {
        errors.email = 'Email is required'
    }


    if (!validator.isLength(data.password, {
            min: 6,
            max: 30
        })) {
        errors.password = 'Password must be atleast 6 characters'
    }



    return {
        errors,
        isvalid: isEmpty(errors)
    }
}