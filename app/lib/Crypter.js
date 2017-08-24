const crypto = require('crypto');

const DEFAULT_CRYPTO_ALGORITHM = 'aes-256-ctr';

var Crypter = function(algorithm, secret) {
  
  if(!algorithm) {
    algorithm = DEFAULT_CRYPTO_ALGORITHM;
  }

  if(!secret) {
    secret = process.env.CRYPTO_SECRET;
  }

  this.encrypt = function(text){
    var cipher = crypto.createCipher(algorithm, secret);
    let crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');

      return crypted;
    };

    this.decrypt = function(text){
      var decipher = crypto.createDecipher(algorithm, secret);
      var dec = decipher.update(text,'hex','utf8')
      dec += decipher.final('utf8');

      return dec;
    };
};

module.exports = new Crypter();