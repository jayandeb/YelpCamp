// TO ACCESS .ENV FILES

if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}
//require('dotenv').config()



// REQUIRE
const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");

const ExpressError = require("./utitlities/ExpressError");
const mongoose = require("mongoose");

const session = require("express-session");
const flash = require("connect-flash");
const helmet= require('helmet');

const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());
const passport = require("passport");
const localStategy = require("passport-local");
const User = require("./models/user");
const MongoStore= require('connect-mongo');



//used to alter form methods
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true })); //parses the request body
app.use(methodOverride("_method"));






//routes
const campgroundRoute = require("./routes/campground");
const reviewRoute = require("./routes/review");
const userRoute = require("./routes/userRegfstoreReturnTotration");

// "mongodb://127.0.0.1:27017/yelp-camp"
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Mongo Connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));


//CONNECT-MONGO PACKAGE to store session information on live production db
const store= MongoStore.create({
  mongoUrl:dbUrl,
  touchAfter:24 * 60 * 60,
  crypto:{
    secret:"thisshouldbebettersecret"
  }
})

store.on("error",function(e){
  console.log("SESSION STORE ERROR")
})

const sessionConfig = {
  store,
  name:'blah',
  secret: "thisshouldbebettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure:true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

//initialize passport
app.use(passport.initialize());
//use passport.session after session
app.use(passport.session());

//authenticate the User model, serilize and deserialize it
passport.use(new localStategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash message
app.use(flash());

// HELMET package
app.use(helmet());


//RESTRICT WHERE WE WANT TO FETCH RESOURSES OR STYLES OR LOAD ONLY SPECIFIC SCRIPT
// this is added so that we show genuiness to the contentsecuritypolicy middleware of helment
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
//This is the array that needs added to
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://api.mapbox.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/dpbuckwew/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
              "https://images.unsplash.com/",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);

//middleware for flash
app.use((req, res, next) => {

  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//hardcoding to text passport-local-mongoose

// app.get('/fakeUser', async (req, res) => {

//     const user = new User({ email: 'y@gmail.com', username: 'jy76' });
//     const newUser = await User.register(user, 'apple');//register the user and provide a passport
//     res.send(newUser)
// })

//routing in routes folder
app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/reviews", reviewRoute);
app.use("/", userRoute);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found!", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no something went wrong!!";
  res.status(statusCode).render("error", { err });
});

// app.get('/makeCampground', async (req, res) => {

//     const camp = new Campground({ title: 'Js Abode', price: '$2.4', description: 'Newly Opened Losts of activities', location: 'Lhomithi Village' })
//     await camp.save();
//     res.send("CampGround Created")


const port= process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
