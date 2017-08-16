const Database = require('../database/Database');

const Home = require('./Home');

var User = Database.getInstance().define('users', {
  // Facebook Id
  id: {
    type: Database.getSequelize().STRING,
    field: 'id',
    primaryKey: true
  },
  pageScopedId: {
    type: Database.getSequelize().STRING,
    field: 'page_scoped_id',
    allowNull: true,
    defaultValue: null
  },
  displayName: {
    type: Database.getSequelize().STRING,
    field: 'displayName',
    allowNull: false,
    defaultValue: ""
  },
  profilePictureUrl: {
    type: Database.getSequelize().STRING,
    field: 'profile_picture_url',
    allowNull: true,
    defaultValue: null
  },
  gender: {
    type: Database.getSequelize().STRING,
    field: 'gender',
    allowNull: false,
    defaultValue: 'neutral'
  }
}, {
  getterMethods: {
    firstName() {
      return this.getDataValue('displayName').split(' ')[0];
    },
    lastName() {
      var split = this.getDataValue('displayName').split(' ');
      return split[split.length - 1];
    },
    salutation() {
      if(this.getDataValue('gender') == 'female') {
        return "Miss";
      }

      return "Master";
    }
  }
});

User.Home = User.hasOne(Home);
Home.User = Home.belongsTo(User);

module.exports = User;