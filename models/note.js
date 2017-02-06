"use strict";

module.exports = function(sequelize, DataTypes) {
    var Note = sequelize.define("note", {
        text: DataTypes.TEXT(),
        owner_type: DataTypes.ENUM('comment', 'reply'),
        owner_id: DataTypes.INTEGER()
    },
    {
        classMethods: {
            associate: function(models) {
                Note.belongsTo(models.user, {foreignKey: 'creator'});
                Note.belongsTo(models.comment, {foreignKey: 'owner_id', as: 'comment', constraints: false});
                Note.belongsTo(models.reply, {foreignKey: 'owner_id', as: 'reply', constraints: false});
            }
        }
    });
    return Note;
};