const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({}); // earse everything in the database
    for (let i = 0; i < 50; i++) { // replace with 50 random camps
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '632e5dc89221dba6e45c2f73',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda aliquid maiores deserunt aperiam eum, enim corrupti consequuntur magni laborum, ab repellat id accusamus? Quam explicabo ex, nisi facere fuga perspiciatis!",
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dherfjyq3/image/upload/v1664085832/YelpCamp/ovhe8h41fogimkawcnmj.jpg',
                    filename: 'YelpCamp/ovhe8h41fogimkawcnmj'
                }
            ]
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close(); // close the mongoose connection with mongo
});  