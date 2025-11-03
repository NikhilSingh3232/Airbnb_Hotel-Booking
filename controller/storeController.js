const Home=require('../model/home');
const User = require("../model/user");

exports.getIndex=(req, res, next) => {
  Home.find().then(registeredHomes=>{
    res.render('store/index', {
      registeredHomes: registeredHomes,
      pageTitle: 'airbnb Home',
      currentPage:'index',
      isLoggedIn:req.isLoggedIn,
      user:req.session.user
    });
  })
}
// HOME
exports.getHome=(req, res, next) => {
  Home.find().then(registeredHomes=>{
    res.render('store/home-list', {
      registeredHomes: registeredHomes,
      pageTitle: 'Home Lists',
      currentPage:'home',
      isLoggedIn:req.isLoggedIn,
      user:req.session.user
    })
  });
}


exports.getFavouritesList =  async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites');
  res.render("store/favourite-list", {
    favouriteHomes: user.favourites,
    pageTitle: "My Favourites",
    currentPage: "favourites",
    isLoggedIn: req.isLoggedIn, 
    user: req.session.user,
  });
};

exports.postAtFavourites =  async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect("/favourites");
};


exports.postRemoveFromFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter(fav => fav != homeId);
    await user.save();
  }
  res.redirect("/favourites");
};


exports.getHomeDetails=(req,res,next)=>{
  const homeId=req.params.homeId;
  Home.findById(homeId).then(home =>{
    if(!home){
      console.log("Homes not founds");
      res.redirect('/home');
    } else{
      res.render('store/home-details', {
      pageTitle: 'Home Details',
      currentPage:'home',
      home:home,
      isLoggedIn:req.isLoggedIn,
      user:req.session.user
    })
    }
  })
}


