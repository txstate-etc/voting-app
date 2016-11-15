"use strict";

module.exports = function(sequelize, DataTypes) {
  var Reply = sequelize.define("reply", {
    text: DataTypes.TEXT(),
    flagged: {type: DataTypes.BOOLEAN(), defaultValue: 0},
    deleted: {type: DataTypes.BOOLEAN(), defaultValue: 0}
  }, {
    classMethods: {
      associate: function(models) {
        Reply.belongsTo(models.comment);
        Reply.belongsTo(models.user);
        Reply.hasMany(models.file, {foreignKey: 'owner_id', constraints: false, scope: {owner_type: 'reply'}});
      }
    }
  });

  return Reply;
};