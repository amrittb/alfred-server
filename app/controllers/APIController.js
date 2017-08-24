var APIController = {};

const Home = require('./../models/Home');
const Instruction = require('./../models/Instruction');

const crypter = require('./../lib/Crypter');

APIController.getRegister = function(req, res) {
  if(req.query && req.query.mac) {
    Home.findOne({
      where: {
        macAddress: req.query.mac
      }
    }).then((home) => {
      if(home) {
        var homeData = JSON.stringify({ homeId: home.id });
        res.send(crypter.encrypt(homeData));
      } else {
        res.status(400).send("Home not registered");
      }
    });
  } else {
    res.status(400).send("Invalid request");
  }
};

APIController.getInstructions = function(req, res) {
  var homeId = req.home.id;
  
  Instruction.findOne({
    where: {
      homeId: homeId,
      isCompleted: false,
      executeAfter: {
        $lte: new Date()
      }
    },
    order: [
      ['executeAfter', 'DESC']
    ]
  }).then((instruction) => {
    if(instruction) {
      instruction.update({
        isCompleted: true
      });
      
      return res.send(instruction.hex);
    } else {
      // Status Response
      return res.send("F");
    }
  })
};

module.exports = APIController;