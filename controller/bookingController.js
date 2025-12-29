const Booking = require('../model/booking');
const Home = require('../model/home');

/* =======================
   GET MY BOOKINGS
======================= */
exports.getBookings = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    const userId = req.session.user._id;

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: 'home',
        select: 'houseName location price'
      });

    res.render('store/bookings', {
      pageTitle: 'My Bookings',
      currentPage: 'bookings',
      bookings,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
      successMessage: req.query.successMessage || null
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).render('500', { pageTitle: 'Error' });
  }
};

/* =======================
   BOOK A HOME
======================= */
exports.postBookHome = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    const homeId = req.params.homeId;
    const { checkIn, checkOut } = req.body;

    // ✅ Validate dates
    if (!checkIn || !checkOut || new Date(checkIn) >= new Date(checkOut)) {
      return res.redirect(`/home/${homeId}?error=Invalid dates`);
    }

    const home = await Home.findById(homeId);

    if (!home) {
      return res.redirect('/home');
    }

    // ✅ Calculate days safely
    const oneDay = 1000 * 60 * 60 * 24;
    const days = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / oneDay
    );

    const totalPrice = home.price * days;

    const booking = new Booking({
      home: home._id,
      user: req.session.user._id,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      totalPrice
    });

    await booking.save();

    res.redirect('/bookings?successMessage=Booking confirmed successfully!');
  } catch (error) {
    console.error('Booking error:', error);
    res.redirect('/home');
  }
};
