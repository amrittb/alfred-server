const Database = require('./Database');

const Migrator = (function() {
  
  const models = [
    'User',
    'Home'
  ];
  
  return {
    syncDatabase: function() {
      for (var i  = 0; i < models.length; i++) {
        require('../models/' + models[i]);
      }


      Database.getInstance().sync();
    }
  }
})();

module.exports = Migrator;