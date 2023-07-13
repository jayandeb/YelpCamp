const { number } = require('joi');
const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;


const reviewSchema = ({
    type: Schema.Types.ObjectId,
    body: String,
    rating: Number,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model('Review', reviewSchema);
