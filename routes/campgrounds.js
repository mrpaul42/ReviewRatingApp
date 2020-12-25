const express = require('express')
const router = express.Router();
const catchAsync = require('../utility/catchAsync');
const {isLoggedIn,isAuthor,validateCamp} = require('../middleware')
const campgroundcontrol = require('../controllers/campgrounds')
const multer  = require('multer')
const {storage} = require(('../cloudinary'))
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(campgroundcontrol.index))
    .post(isLoggedIn,upload.array('file'),validateCamp, catchAsync(campgroundcontrol.createCamp));
    // .post(upload.array('file'),(req,res)=>{
    //     console.log(req.body, req.files);
    //     res.send('it worked');
    // })
    
router.get('/new',isLoggedIn,campgroundcontrol.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgroundcontrol.showCamp))
    .put(isLoggedIn,isAuthor,upload.array('file'),validateCamp, catchAsync(campgroundcontrol.editCamp))
    .delete(isLoggedIn,isAuthor, catchAsync(campgroundcontrol.deleteCamp));

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgroundcontrol.renderEditCamp));

module.exports = router;