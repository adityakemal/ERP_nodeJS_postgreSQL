'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    costumerId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    statusOrder: DataTypes.BOOLEAN
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
    Order.belongsTo(models.User,{foreignKey:"costumerId"})
    Order.belongsTo(models.Product,{foreignKey:"productId"})

  };
  return Order;
};
