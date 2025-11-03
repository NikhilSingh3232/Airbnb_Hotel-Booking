// core Module
const path = require('path');

// Express module
const express = require('express');
const session = require('express-session');
const { default: mongoose } = require('mongoose');
const mongoStore = require('connect-mongodb-session')(session);
const DB_PATH = "mongodb+srv://Rb11xc:Rb11xc@nikhilproject.5arss37.mongodb.net/airbnb?retryWrites=true&w=majority&appName=NikhilProject";
const multer = require('multer');



// Local modules
const storeRouter = require('./Router/storeRouter');
const hostRouter = require('./Router/hostRouter');
const authRouter = require('./Router/authRouter');
const bookingRouter = require('./Router/bookingRouter');
const rootDir = require('./utils/PathUtil');
const errorController = require('./controller/404');


const app = express();

// EJS setup
app.set('view engine', 'ejs');
app.set('views', 'views');

// mongoStore
const store = new mongoStore({
  uri: DB_PATH, // ✅ fixed: 'uri' instead of 'url'
  collection: 'session',
});

const randomString= (length)=>{
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length; 
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


const storage= multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'uploads/');
  },
  filename:function(req,file,cb){
    cb(null,randomString(10) +'-'+ file.originalname);
  }
});

const fileFilter= (req,file,cb)=>{
  if(
    file.mimetype==='image/jpg'||
    file.mimetype==='image/png'||
    file.mimetype==='image/jpeg'  
  ){
    cb(null,true);
  }else{
    cb(null,false);
  }
};


const multerOption = {
  storage,fileFilter
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(multer(multerOption).single('photo'));

// ✅ Serve static files (must be BEFORE routes)
app.use(express.static(path.join(rootDir, 'public')));
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
app.use('/homes/uploads', express.static(path.join(rootDir, 'uploads')));

app.use(
  session({
    secret: "i am Nikhil Singh",
    resave: false,
    saveUninitialized: false,
    store,
  })
);



app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

// ✅ Public routes (no login needed)
app.use(authRouter);
app.use(storeRouter);
app.use(bookingRouter);

// ✅ Authentication guard (only for host routes)
app.use((req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    // allow login & signup routes to render UI
    if (req.path === '/login' || req.path === '/signup') {
      return next();
    }
    res.redirect('/login');
  }
});

// ✅ Protected routes
app.use(hostRouter);

// ✅ 404 Handler
app.use(errorController.handleError);

const PORT = 3003;

mongoose
  .connect(DB_PATH)
  .then(() => {
    //console.log('Connected to mongoose');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.log("Error while connecting to mongoose", err);
  });
