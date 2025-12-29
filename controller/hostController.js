
const Home=require('../model/home');
const fs=require('fs');

// ADD HOME
exports.getAddHome=(req, res, next) => {
  res.render('host/edit-home', {
    pageTitle: 'Add Home to airbnb',
    currentPage:'addHome',
    editing:false,
    isLoggedIn:req.isLoggedIn,
    user:req.session.user
  });
}

// edit home
exports.getEditHome=(req, res, next) => {
  const homeId=req.params.homeId;
  const editing=req.query.editing ==='true';

  Home.findById(homeId).then(home =>{
    if(!home){
      console.log("Home is not found editing");
      return res.redirect("/host-home-lists");
    }
    res.render('host/edit-home', {
      home:home,
      pageTitle: 'Edit Your Home',
      currentPage:'host-homes',
      editing:editing,
      isLoggedIn:req.isLoggedIn,
      user:req.session.user
    });
  });
}

exports.getHostHomes=(req, res, next) => {
  Home.find().then(registeredHomes =>{
    res.render('host/host-home-list', {
      registeredHomes: registeredHomes,
      pageTitle: 'Host Home List',
      currentPage:'host-homes',
      isLoggedIn:req.isLoggedIn,
      user:req.session.user
    })
  });
}

// REGISTER HOME SUCESSFUL

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;
  if(!req.file){
    return res.status(422).send('No image provided.');
  }
  const photo = req.file.path;  

  const home = new Home({houseName, price, location, rating, photo,description});
  home.save().then(()=>{
  });
  res.redirect("/host-home-lists");
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating,  description } = req.body;


  Home.findById(id).then(home => {
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.description = description;

    if(req.file){
      fs.unlink(home.photo, (err) => {
        if (err) {
          console.log("Error while deleting old image", err);
        }
      });
       home.photo = req.file.path;
    }

    home.save().then(result => {
    }).catch(err => {
      console.log("Error while Updating", err);
    });
    res.redirect("/host-home-lists");
  }).catch(err => {
    console.log("Error while finding home", err);
  });
};

 


exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  
  return Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host-home-lists");
    })
    .catch(error => {
      console.log('Error while deleting', error);
    });
};


