const express = require('express');
const router = express.Router()


const CampgroundController = require('../controller/campgroundController')
const { campgroundSchema } = require('../schema')
const CatchAsync = require('../utitlities/CatchAsync')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware/loginMiddleware');
const { route } = require('./userRegistration');

const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage })

//fance way to route
router.route('/')
    .get(CatchAsync(CampgroundController.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, CatchAsync(CampgroundController.createCampground));

// .post(upload.array('image'), (req, res) => {
//     // console.log(req.body, req.files)
//     // res.send('It Worked')
//     try {
//         console.log(req.body, req.files);
//         res.send('It Worked');
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Internal Server Error');
//     }
// })

router.get('/new', isLoggedIn, CampgroundController.renderNewForm);

router.route('/:id')
    .get(CatchAsync(CampgroundController.renderCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, CatchAsync(CampgroundController.editCampground))
    .delete(isLoggedIn, CatchAsync(CampgroundController.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(CampgroundController.renderEditCampgroundForm));


// router.get('/', CatchAsync(CampgroundController.index));

// // new DISPLAY
// router.get('/new', isLoggedIn, CampgroundController.renderNewForm)

// router.get('/:id', CatchAsync(CampgroundController.renderCampground));

// // NEW ADD TO MONGODB AND SHOW
// router.post('/', isLoggedIn, validateCampground, CatchAsync(CampgroundController.createCampground));

// // EDIT DISPLAY
// router.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(CampgroundController.renderEditCampgroundForm));

// // EDIT
// router.put('/:id', isLoggedIn, isAuthor, validateCampground, CatchAsync(CampgroundController.editCampground))

// // delete from DB and List
// router.delete('/:id', isLoggedIn, CatchAsync(CampgroundController.deleteCampground))

module.exports = router;