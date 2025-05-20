const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require('../views/middleware.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});

//index route
//collecting the data and adding it to database
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.array('listing[image]',3),validateListing,wrapAsync(listingController.createListing));

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//search route based on category
router.get("/category",wrapAsync(listingController.searchCategory));

//search route based on title
router.get("/name",wrapAsync(listingController.searchTitle));

//show route (read operation)
//updating the database based on id
//deleting the data (delete route)
router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.array('listing[image]',3),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


//editing request
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;