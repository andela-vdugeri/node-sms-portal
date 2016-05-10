'use strict';

module.exports = function (sequelize, DataTypes) {
  var Subscription = sequelize.define('Subscription', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, unique: true, primaryKey: true},
    messageUnits: { type: DataTypes.INTEGER}
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
      associate: function(models) {
        Subscription.belongsTo(models.User, { foreignKey: 'user_id' });
      }
    }
  });

  return Subscription;
};
