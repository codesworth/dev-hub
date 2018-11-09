const express = require('express');
const router = express.Router();


//@route   GET api/profile/test
//@desc    Tests profile routes
//@acess   Public
router.get('/test', (request, response) => {
    response.json({msg:"User Test passed"});
});


module.exports = router;