const Booking = require('../model/booking');
const Home = require('../model/home');

exports.getBookings = async (req, res, next) => {
  const userId = req.session.user._id;
  const bookings = await Booking.find({ user: userId }).populate('home');
  res.render('store/bookings', {
    pageTitle: 'My Bookings',
    currentPage: 'bookings',
    bookings,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
    successMessage: req.query.successMessage || null
  });
};

exports.postBookHome = async (req, res, next) => {
  const homeId = req.params.homeId;
  const { checkIn, checkOut } = req.body;
  const home = await Home.findById(homeId);

  if (!home) return res.redirect('/home');

  const days = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
  const totalPrice = home.price * days;

  const booking = new Booking({
    home: homeId,
    user: req.session.user._id,
    checkIn,
    checkOut,
    totalPrice
  });
  await booking.save();

  res.redirect('/bookings?successMessage=Booking confirmed successfully!');
};
