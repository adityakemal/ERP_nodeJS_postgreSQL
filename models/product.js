'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    productName: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.STRING
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
    Product.hasMany(models.Order, {foreignKey : 'productId'})
  };
  return Product;
};
