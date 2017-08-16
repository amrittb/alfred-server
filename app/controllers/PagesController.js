const Database = require('./../database/Database');

var PagesController = {};

PagesController.getIndex =  function (req, res) {
  res.render('index.html')
};


PagesController.getDbReset = function(req, res) {
  Database.getInstance().drop().then(() => {
    Database.getInstance().sync();
  });
  
  res.redirect('/');
};

PagesController.getDashboard = function(req, res) {
  res.render('dashboard/index.html', {
    user: req.user
  });
};

PagesController.getLogOut = function(req, res) {
  req.logout();
  res.redirect('/');
};

module.exports = PagesController;