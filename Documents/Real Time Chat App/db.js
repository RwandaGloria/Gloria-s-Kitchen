const mysql = require('mysql')
const { Sequelize, DataTypes } = require('sequelize');


SQL_HOST = process.env.SQL_HOST;
SQL_USER_NAME = process.env.SQL_USER_NAME;
SQL_PASSWORD = process.env.SQL_PASSWORD;
SQL_PORT = 3306;
SQL_DB_NAME=process.env.SQL_DB_NAME

const connection = mysql.createConnection({

    host: SQL_HOST,
    user: SQL_USER_NAME,
    password: SQL_PASSWORD,
    PORT: SQL_PORT

})

const sequelize = new Sequelize(SQL_DB_NAME, SQL_USER_NAME, SQL_PASSWORD, {
  host: SQL_HOST,
  dialect: 'mysql'
});




function connect() {
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to Amazon RDS has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

}
  const db = {}
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  db.orders = require('./models/orders')(sequelize, Sequelize);
  db.order_items = require('./models/order_items')(sequelize, Sequelize);
  db.dishes = require('./models/items')(sequelize, Sequelize);
  db.users = require('./models/users')(sequelize, Sequelize);

  // db.orders.belongsToMany(db.dishes, { through:   db.order_items });

  db.order_items.belongsTo(db.orders, { foreignKey: "order_id" });
  db.orders.hasMany(db.order_items, { foreignKey: "order_id" });

  // db.dishes.belongsToMany(  db.orders, { through:  db.order_items });
  
  
  db.users.hasMany(db.orders);
  db.orders.belongsTo(db.users);

//   db.orders.hasMany(db.dishes);
// db.dishes.belongsTo(db.orders);


  db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Database & tables synced');
    }).catch(err => {
        console.error('Unable to sync database & tables:', err);
    })
  
  
  



module.exports = {connect, db}