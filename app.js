if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport"); // Move the passport import here
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const path = require("path");
const port = 3000;


// Session options
const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    touchAfter: 24 * 3600,
    crypto : {
        secret : process.env.SECRET
    }
});

store.on("error", function(e){
    console.log("Session store error : ", e);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};



// Middleware setup
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize()); // Fixed typo
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Template engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Middleware
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

// Flash messages
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// MongoDB connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dburl);
}
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });


// Routes
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.get("/",(req,res)=>{
    res.redirect("/listings");
});
app.use("/listings", listingsRouter);   
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// Demo user route
app.get("/demouser", async (req, res) => {
    const fakeUser = new User({
        email: "xyz@gmail.com",
        username: "delta-student",
    });
    const registerUser = await User.register(fakeUser, "helloworld");
    res.send(registerUser);
});

// Home route
// app.get("/", (req, res) => {
//     res.send("Hi, welcome to the first project");
// });

// Catch-all route for unknown paths
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
});

// Start server
app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});
