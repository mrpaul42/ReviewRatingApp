const mongoose = require('mongoose');
const { schema } = require('./review');
const review = require('./review');
const {Schema} = mongoose

const imageSchema = new Schema({
        url:String,
        filename:String
});
imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const opts = {toJSON: {virtuals:true}};

const Campgroundschema = new Schema({
    title: String,
    images: [imageSchema],
    price: {
        type: Number,
        min: 0
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
},opts);

Campgroundschema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`
})

Campgroundschema.post('findOneAndDelete',async function(doc){
    if(doc)
    {
        await review.deleteMany({_id:{$in: doc.reviews}})
    }
})
// Campgroundschema.post('findOneAndDelete', async function (doc) {
//     if (doc) {
//         await Review.deleteMany({
//             _id: {
//                 $in: doc.reviews
//             }
//         })
//     }
// })

module.exports = mongoose.model('Campground', Campgroundschema)