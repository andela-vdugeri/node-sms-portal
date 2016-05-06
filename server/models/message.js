'use strict';

module.exports = function (sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, unique: true},
    body: { type: DataTypes.TEXT}
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
        Message.belongsTo(models.User, {foreignKey: 'user_id'});
        Message.belongsTo(models.Transaction, {foreignKey: 'transaction_id'});
      }
    }
  });

  return Message;
};
