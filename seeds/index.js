const express = require('express');
const mongoose = require('mongoose');
const Campground = require('../models/campground')
const Cities = require('./cities')
const { places, descriptors } = require('./seedHelpers');
const cities = require('./cities');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Mongo Connected")
})


const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (i = 0; i <= 50; i++) {

        const random = Math.floor(Math.random() * 1000);
        const campprice = Math.floor(Math.random() * 10) + 1;
        const c = new Campground({
            author: '649322e8723d0aff6e76e4bb',
            location: `${Cities[random].city},${Cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Ex esse qui magna nostrud aute nostrud officia magna dolor elit ea nulla laboris id.',
geometry:{type: "Point", coordinates: [cities[random].longitude,cities[random].latitude]},
            price: `${campprice}`,
            image: [{
                url: 'https://res.cloudinary.com/dpbuckwew/image/upload/v1687795345/YelpCamp/ary325qq5h6nrox3gdzp.jpg',
                fileName: 'YelpCamp/ary325qq5h6nrox3gdzp',

            },
            {
                url: 'https://res.cloudinary.com/dpbuckwew/image/upload/v1687795346/YelpCamp/azwxw8gdkhzgtbqgr2zq.jpg',
                fileName: 'YelpCamp/azwxw8gdkhzgtbqgr2zq',

            },
            {
                url: 'https://res.cloudinary.com/dpbuckwew/image/upload/v1687795346/YelpCamp/qpmjhdr61oijg4znmqpk.jpg',
                fileName: 'YelpCamp/qpmjhdr61oijg4znmqpk',

            },
            {
                url: 'https://res.cloudinary.com/dpbuckwew/image/upload/v1687795347/YelpCamp/cjlmvpxaljmcnmpscapn.jpg',
                fileName: 'YelpCamp/cjlmvpxaljmcnmpscapn',

            }
            ]
        })
        await c.save()
    }


}

seedDB().then(() => {
    mongoose.connection.close();
})

