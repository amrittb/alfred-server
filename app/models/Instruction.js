const Database = require('../database/Database');


var Instruction = Database.getInstance().define('instructions', {
  id: {
    type: Database.getSequelize().INTEGER,
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  },
  onOff: {
    type: Database.getSequelize().STRING,
    field: 'on_off',
    allowNull: false
  },
  pinNum: {
    type: Database.getSequelize().INTEGER,
    field: 'pin_num',
    allowNull: false
  },
  isCompleted: {
    type: Database.getSequelize().BOOLEAN,
    field: 'is_completed',
    allowNull: false,
    defaultValue: false
  },
  executeAfter: {
    type: Database.getSequelize().DATE,
    field: 'execute_after',
    allowNull: false,
    defaultValue: Database.getSequelize().NOW
  }
}, {
  getterMethods: {
    hex() {
      var codeWord = 0;

      if(this.getDataValue('onOff') == "on") {
        codeWord += 4;
      } else if(this.getDataValue("onOff") == "toggle") {
        codeWord += 8;
      }
      
      codeWord += this.getDataValue('pinNum');
      
      console.log("Code Word sent", codeWord);
      
      return codeWord.toString(16);
    }
  }
});

module.exports = Instruction;