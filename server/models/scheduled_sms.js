'use strict';

module.exports = function (sequelize, DataTypes) {
  var ScheduledSms = sequelize.define('ScheduledSms', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    message: { type: DataTypes.TEXT },
    sendTime: { type: DataTypes.DATE },
    receivers: { type: DataTypes.ARRAY(DataTypes.STRING) },
    sent: { type: DataTypes.BOOLEAN, defaultValue: false }
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
        ScheduledSms.belongsTo(models.User, { foreignKey: 'user_id' });
      }
    }
  });

  return ScheduledSms;
};
