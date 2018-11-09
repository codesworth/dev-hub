const express = require('express');
const router = express.Router();


//@route   GET api/profile/test
//@desc    Tests Profile routes
//@acess   Public
router.get('/test', (request, response) => {
    response.json({msg:"Profile Test passed"});
});


module.exports = router;