const express = require('express');
const router = express.Router();


//@route   GET api/posts/test
//@desc    Tests posts routes
//@acess   Public
router.get('/test', (request, response) => {
    response.json({msg:"Posts Test passed"});
});


module.exports = router;