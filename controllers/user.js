const User = require('../models/user');

module.exports.renderRegister = (req, res)=>{
    res.render('users/register');
}

module.exports.signUp = async(req,res, next)=>{
    try{
        const {username, email, password} = req.body;
        const user = new User({username,email});
        const newuser = await User.register(user,password); 
        req.login(newuser, err=>{
            if(err) return next(err);
            req.flash('success','welcome to yelp camp!')
            res.redirect('/campgrounds');
        })
        
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res)=>{
    res.render('users/login');
}

module.exports.Login = (req, res)=>{
    req.flash('success','welcome back')
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.LogOut = (req,res)=>{
    req.logout();
    req.flash('success','Loged out');
    res.redirect('/campgrounds');
}