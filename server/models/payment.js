'use strict';

module.exports = function (sequelize, DataTypes) {
  var Payment = sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
    amount: { type: DataTypes.DECIMAL, unsigned: true },
    description: { type: DataTypes.TEXT },
    username: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN, default: false }
  }, {
    underscored: true,
    instanceMethods: {
      toJson: function () {
        var value = this.get();
        delete value.created_at;
        delete value.updated_at;
        return value;
      }
    },
    classMethods: {
      associate: function (models) {
        Payment.belongsTo(models.User, { foreignKey: 'user_id' });
      }
    }
  });

  return Payment;
};
