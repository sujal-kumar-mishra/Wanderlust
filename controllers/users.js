const User = require('../models/user');

module.exports.signupForm = (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res) => {
    try{
        let {username ,email ,password} = req.body;
        const newUser = new User({email,username});
        const registerUser = await User.register(newUser,password);
        console.log(registerUser);
        req.login(registerUser,(err) => {
            if(err){
                return next(err);
            }

            let redirectUrl = res.locals.redirectUrl || '/listings';
            req.flash("success","Welcome to WanderLust!");
            return res.redirect(`${redirectUrl}`);
        })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings"; 
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
};