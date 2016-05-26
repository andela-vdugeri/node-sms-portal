'use strict';

module.exports = function (sequelize, DataTypes) {
  var Pricing = sequelize.define('Pricing', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
    unitPrice: { type: DataTypes.DECIMAL }
  }, {
    underscored: true,
    instanceMethods: {
      toJson: function () {
        var value = this.get();
        delete value.created_at;
        delete value.updated_at;
        return value;
      }
    }
  });

  return Pricing;
};
