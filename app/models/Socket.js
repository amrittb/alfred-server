const Database = require('../database/Database');

var Socket = Database.getInstance().define('sockets', {
  id: {
    type: Database.getSequelize().INTEGER,
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Database.getSequelize().STRING,
    field: 'name',
    allowNull: false
  },
  accessorName: {
    type: Database.getSequelize().STRING,
    field: 'accessor_name',
    allowNull: false
  }
});

module.exports = Socket;