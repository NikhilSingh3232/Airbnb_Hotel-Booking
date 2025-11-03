 const { check, validationResult } = require("express-validator");
 const User=require('../model/user');
 const bcrypt=require('bcryptjs');
const user = require("../model/user");

 exports.getLogin=(req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    currentPage:'Login',
    isLoggedIn:false,
    errors:[],
    oldInput:{email:''},
    user:{},
  });
}

 exports.getSignup=(req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    currentPage:'Signup',
    isLoggedIn:false,
    errors:[],
    oldInput:{firstName:'',lastName:'',email:'',userType:''},
    user:{},
  });
}

//login controller
exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      currentPage: 'login',
      isLoggedIn: false,
      errors: ["user does not exist"],
      oldInput: { email },
      user:{},
    });
  }
  const doMatch = await bcrypt.compare(password, user.password);
  if (!doMatch) {
    return res.status(422).render('auth/login', {
      pageTitle: 'Login', 
      currentPage: 'login',
      isLoggedIn: false,
      errors: ["Invalid password"],
      oldInput: { email },
      user:{},
    });
  }

  req.session.isLoggedIn=true
  req.session.user=user;
  await req.session.save();
  res.redirect("/");
}

//signup controller
exports.postSignup=[
  check('firstName')
  .trim()
  .isLength({min:2})
  .withMessage('First Name must be at least 2 characters long')
  .matches(/^[A-Za-z]+$/)
  .withMessage('First Name must contain only alphabetic characters'),

  check('lastName')
  .matches(/^[A-Za-z]*$/)
  .withMessage('Last Name must contain only alphabetic characters'),

  check('email')
  .isEmail()
  .withMessage('please entre a valid email address')
  .normalizeEmail(),
  
  check('password')
  .isLength({min:6})
  .withMessage('password must be at least 6 characters long')
  .matches(/[A-Z]/)
  .withMessage('password must contain at least one uppercase Letter')
  .matches(/[0-9]/)
  .withMessage('password must contain at least one number') 
  .matches(/[a-z]/)
  .withMessage('passwword must contain at least one lowercase letter')
  .matches(/[!@&]/)
  .withMessage('password must contain at least one special character')
  .trim(),

  check('confirmPassword')
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true; 
  }),

  check('userType')
  .notEmpty()
  .withMessage('Please select a user type')
  .isIn(['host','guest'])
  .withMessage('Invalid user type selected'),

  check('terms')
  .notEmpty()
  .withMessage('You must accept the terms and conditions')
  .custom((value) => {
    if (value !== 'on') {
      throw new Error('You must accept the terms and conditions');
    }
    return true;
  }),
  
  
  (req,res,next)=>{
    const {firstName,lastName,email,password,userType}=req.body;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).render('auth/signup',{
        pageTitle:'Signup',
        currentPage:'Signup',
        isLoggedIn:false,
        errors:errors.array().map(err=>err.msg),
        oldInput:{firstName,lastName,email,password,userType},
        user:{},
      });
    }

    bcrypt.hash(password,12).then(hashedPassword=>{
      const user=new User({firstName,lastName,email,password:hashedPassword,userType});
      return user.save();
    }).then(()=>{
      res.redirect("/login");
    }).catch(err=>{
      return res.status(422).render('auth/signup',{
        pageTitle:'Signup', 
        currentPage:'Signup',
        isLoggedIn:false,
        errors:[err.message],
        oldInput:{firstName,lastName,email,password,userType},
        user:{},
      });
    });
  }];

  //logout controller
exports.postLogout=(req,res,next)=>{
  console.log(req.body);
  req.session.isLoggedIn=false
  // res.cookie("isLoggedIn",false);
  res.redirect("/login");
}

