const Listing = require('../models/listing');
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const { reviewSchema } = require("../schema.js");
const Review = require('../models/review.js');

module.exports.isLoggedIn = (req,res,next) => {
    console.log('middleware1');
    if(!req.isAuthenticated()){ // passport method
        //redirect
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listings");
        return res.redirect("/login");
    }

    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    console.log('middleware2');
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) => {
    console.log('middleware3');
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of listing")
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.validateListing = (req,res,next)=>{
    console.log('middleware4');
    let { error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next) => {
    console.log('middleware5');
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


module.exports.isReviewAuthor = async(req,res,next) => {
    let {id , reviewId} = req.params;
    console.log('middleware6');
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of review")
        return res.redirect(`/listings/${id}`);
    }

    next();
};