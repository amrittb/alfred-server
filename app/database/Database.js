var Sequelize = require('sequelize');

const Database = (function() {
  var instance;
  
  function createInstance() {
    var sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASS, {
                        host: process.env.DB_HOST,
                        dialect: 'sqlite',
                        pool: {
                          max: 5,
                          min: 0,
                          idle: 10000
                        },
                        storage: process.env.DB_STORAGE
                      });
    
    return sequelize;
  }
  
  return {
    getInstance: function() {
      if(!instance) {
        instance = createInstance();
      }
      
      return instance;
    },
    
    getSequelize: function() {
        return Sequelize;
    }
  }
})();

module.exports = Database;