const mongoose = require('mongoose');
const { campgroundSchema } = require('../schema');
const Review = require('./review');
const { string } = require('joi');

const Schema = mongoose.Schema;

// ImageSchema to create a virtual
const ImageSchema = new Schema({
    url: String,
    fileName: String
})

// https://res.cloudinary.com/dpbuckwew/image/upload/w_200/v1687795347/YelpCamp/cjlmvpxaljmcnmpscapn.jpg

// we use virtual to generate desired value which we can use without storing it in the database 
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

// MONGOOSE BY DEFAULT DOESNT INCLUDE VIRTUALS WHEN YOU CONVERT A DOC TO JSON
const opts = { toJSON: { virtuals: true } }; //WE NEED TO PASS THIS AND INCLUDE IN THE DESIRED SCHEMA

const CampgroundSchema = new Schema({
    title: String,
    geometry: {
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
    price: Number,
    description: String,
    location: String,
    image: [ImageSchema] //including ImageSchema
    ,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts)

CampgroundSchema.virtual('properties.popupMarkup').get(function () {
    return `
    <a href="/campgrounds/${this._id}">${this.title}</a>
  `
//   <p>${this.description.substring(0,40)}..</p>
})



CampgroundSchema.post('findOneAndDelete', async function (doc) {

    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('campground', CampgroundSchema)