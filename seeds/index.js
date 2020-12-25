const campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seed');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelpcamp', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('database connected');
});
const sample = arr => arr[(Math.floor(Math.random() * arr.length))];

const seedDB = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const c = new campground({
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            author:'5fe1b6f1a0095c11e3ddad83',
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem necessitatibus, incidunt aliquam ut aut unde repellat quisquam? Excepturi corporis, dolorum sed molestiae repellendus reprehenderit officia debitis officiis veritatis culpa ducimus!',
            price,
            geometry:{
                type:'Point',
                coordinates:[
                    cities[random].longitude,
                    cities[random].latitude,
                ]
            },
            images:[
                { 
                    url:'https://res.cloudinary.com/mrpaulcloud/image/upload/v1608732551/YelpCamp/jdpbyghqub5jtcvkucwr.jpg',
                    filename: 'YelpCamp/jdpbyghqub5jtcvkucwr' },
                  { 
                    url:'https://res.cloudinary.com/mrpaulcloud/image/upload/v1608732552/YelpCamp/lrlpf2ccgvmesb1yqkgn.jpg',
                    filename: 'YelpCamp/lrlpf2ccgvmesb1yqkgn' }
            ]
        })
        await c.save();
    }

}
seedDB().then(() => {
    mongoose.connection.close()
})