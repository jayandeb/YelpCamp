const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/index')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mbxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mbxToken })

// to got to the index
module.exports.index = async (req, res, next) => {
    const camp = await Campground.find({});
    res.render('campgrounds/index', { camp })
}


//redirect to new campground form page
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}


//display campground display
module.exports.renderCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find the campground')
        return res.redirect('/campgrounds');
    }
    // console.log(campground);
    res.render('campgrounds/show', { campground })
}

//create new campground
module.exports.createCampground = async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();

    const newCampground = new Campground(req.body.campground);
    newCampground.geometry = geoData.body.features[0].geometry;//inserts geometry data to schema
    newCampground.image = req.files.map(f => ({ url: f.path, fileName: f.filename }))
    newCampground.author = req.user._id;
    await newCampground.save();
    console.log(newCampground);
    req.flash('success', 'Successfully created a campground');
    res.redirect(`/campgrounds/${newCampground._id}`)
}


// render edit campground page
module.exports.renderEditCampgroundForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find the campground')
        return res.redirect(`/campgrounds/${id}`);
    }
    res.render(`campgrounds/edit`, { campground })
}

//update existing campground
module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params;

    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, fileName: f.filename }));
    campground.image.push(...imgs);

    campground.save();
    if (req.body.deleteImages) {
        for (let fileNames of req.body.deleteImages) {
            await cloudinary.uploader.destroy(fileNames)
        }
        await campground.updateOne({ $pull: { image: { fileName: { $in: req.body.deleteImages } } } })

    }
    req.flash('success', 'Successfully Updated a campground');
    res.redirect(`/campgrounds/${campground._id}`)
}


//delete campground
module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully Deleted a campground');
    res.redirect('/campgrounds')
}