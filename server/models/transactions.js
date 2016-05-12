'use strict';

module.exports = function (sequelize, DataTypes) {
  var Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, unique: true},
    messageUnits: { type: DataTypes.INTEGER},
    receivers: { type: DataTypes.ARRAY(DataTypes.STRING)}
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
        Transaction.belongsTo(models.User, { foreignKey: 'user_id' });
      }
    }
  });

  return Transaction;
};
