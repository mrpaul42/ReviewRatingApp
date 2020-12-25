const campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken:mapBoxToken})

module.exports.index = async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('camp/index', { campgrounds });
}

module.exports.renderNewForm =  (req, res) => {
    res.render('camp/new');
}

module.exports.createCamp = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    const camp = new campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map(f=>({url:f.path, filename:f.filename}));
    camp.author = req.user._id;
    await camp.save();
    // console.log(camp);
    req.flash('success','Successfully made a new campground!!')
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.showCamp = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campgrounds)
    {
        req.flash('error','Cannot find Campground');
         return res.redirect('/campgrounds');
    }
    res.render('camp/show', { campgrounds });
}

module.exports.renderEditCamp = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await campground.findById(id);
    if(!campgrounds)
    {
        req.flash('error','Cannot find Campground');
         return res.redirect('/campgrounds');
    }
    res.render('camp/edit', { campgrounds });
}

module.exports.editCamp = async (req, res) => {
    const { id } = req.params;
    const camp = await campground.findByIdAndUpdate(id, { ...req.body.campground })
    const imgs = req.files.map(f=>({url:f.path, filename:f.filename}))
    camp.images.push(...imgs);
    await camp.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','Successfully Update campground')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success','Successfully campground delete')
    res.redirect('/campgrounds');
}