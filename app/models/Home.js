const Database = require('../database/Database');

const Instruction = require('./Instruction');

var Home = Database.getInstance().define('homes', {
  id: {
    type: Database.getSequelize().INTEGER,
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Database.getSequelize().STRING,
    field: 'name',
    allowNull: true,
    defaultValue: null
  },
  macAddress: {
    type: Database.getSequelize().STRING,
    field: 'mac_address',
    allowNull: false,
    defaultValue: ""
  }
});

Home.Instruction = Home.hasMany(Instruction);
Instruction.Home = Instruction.belongsTo(Home);

module.exports = Home;