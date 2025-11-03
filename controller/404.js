exports.handleError=(req, res, next) => {
  res.render('404', { 
    pageTitle: 'Page Not Found 404',
    currentPage:'404',
    isLoggedIn:req.isLoggedIn,
    user:req.session.user,
  });
}