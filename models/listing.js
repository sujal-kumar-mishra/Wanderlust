const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : [{
       url : String,
       filename : String,
    }],
    price : {
        type : Number,
        required : true
    },
    location : String,
    country : String,
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : "Review"
    }],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    geometry : {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
        },
    category: [{
        type: String,
        enum: [
            "Rooms",
            "Mountain",
            "Luxury",
            "Vacation Rentals",
            "Beachfront",
            "Mountain Retreat",
            "Eco-Friendly",
            "Historic",
            "Modern",
            "Private",
            "Tropical",
            "Rustic",
            "Ski Resort",
            "Art Deco",
            "Castle",
            "Treehouse",
            "Villa",
            "Bungalow",
            "Cabin",
            "Apartment",
            "Cottage",
            "Log Cabin",
            "Desert Oasis",
            "Beach House",
            "Island",
            "Castle",
            "Farms",
        ]
    }]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;