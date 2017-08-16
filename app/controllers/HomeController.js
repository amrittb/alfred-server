const Database = require('./../database/Database');

const Home = require('./../models/Home');
const User = require('./../models/User');

var HomeController = {};

HomeController.getHomeSetup = function(req, res) {
  req.user.getHome().then(home => {
    res.render('dashboard/home/setup.html', {
      user: req.user,
      home: home
    });
  });
};

HomeController.postHomeSetup = function(req, res) {
  if(req.body.id) {
    Home.findById(req.body.id).then(home => {
      console.log("Home found", home)
      home.update({
        name: req.body.name,
        macAddress: req.body.macAddress,
        // sockets: req.body.sockets
      }, {
        // include: [ Socket ]
      }).then(() => {
        console.log("Home Updated");
      });
    });
  } else {
    Home.create({
      name: req.body.name,
      macAddress: req.body.macAddress,
      userId: req.user.id
    },{
      include: [
        {
          association: User.Home,
        }
      ]
    }).then(home => {
      console.log("Home created", home)
    });
  }
  
  res.redirect('/home/setup');
};

module.exports = HomeController;