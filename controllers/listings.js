const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const cloudinary = require('cloudinary').v2;


module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render('listings/index.ejs',{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : 'reviews',populate : {path : "author"}}).populate('owner');

    if(!listing){
        req.flash("error","Listing you requested does not exist");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs",{listing});
};


module.exports.createListing = async (req,res,next)=>{
    let coordinate = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
    console.log(req.file);
    let image = [];
    for(let i = 0 ; i < req.files.length ; i++){
        let object = {};
        object.url = req.files[i].path;
        object.filename = req.files[i].filename;
        image.push(object);
        console.log("inside" ,image);
    }

    // console.log(image);

    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = image;

    newListing.geometry = coordinate.body.features[0].geometry;
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing){
        req.flash("error","Listing you requested does not exist");
        return res.redirect("/listings");
    }

    let originalImageUrl = [];

    listing.image.forEach((img) => {
        console.log(img.url);
        img.url = img.url.replace("upload","upload/c_scale,w_100/q_auto/f_auto");
        originalImageUrl.push(img.url);
    });
    
    // console.log(originalImageUrl);

    res.render("listings/edit.ejs",{listing , originalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listings");
    }
    let {id} = req.params;

    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.files !=="undefined" && req.files.length > 0){
        await listing.image.forEach((img) => {
            let filename = img.filename;
            cloudinary.uploader.destroy(filename,(err,result) => {
            if(err){
                    console.log(err);
            }else{
                    console.log(result);
                }
            });
        });
        
        let image = [];
        
        for(let i = 0 ; i < req.files.length ; i++){
            let object = {};
            object.url = req.files[i].path;
            object.filename = req.files[i].filename;
            image.push(object);
            console.log("inside" ,image);
        }
        
        listing.image = image;
        await listing.save();
    }


    req.flash("success","Listing Updated!");
    res.redirect("/listings");
};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedData = await Listing.findByIdAndDelete(id);

    await deletedData.image.forEach((img) => {
        let filename = img.filename;
            cloudinary.uploader.destroy(filename,(err,result) => {
            if(err){
                console.log(err);
            }else{
                console.log(result);
            }
        });
    });

    console.log(deletedData);

    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

module.exports.searchCategory = async (req,res)=>{
    // console.log(req.query);
    let {search} = req.query;
    // console.log(search);
    let allListings = await Listing.find({ category : search });
    res.render('listings/index.ejs',{allListings});
};


module.exports.searchTitle = async (req,res)=>{
    let {title} = req.query;
    let allListings = await Listing.find({title : title});
    res.render('listings/index.ejs',{allListings});
};