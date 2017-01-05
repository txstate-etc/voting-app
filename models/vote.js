"use strict";

module.exports = function(sequelize, DataTypes) {
  var Vote = sequelize.define("vote", {
    score: DataTypes.INTEGER(),
  }, {
    classMethods: {
       associate: function(models) {
         Vote.belongsTo(models.idea,{
          foreignKey: {
            name: 'idea_id',
            allowNull: false,
          }});
         Vote.belongsTo(models.user, {
          foreignKey: {
            name: 'user_id',
            allowNull: false,
          }});
       },
       createOrUpdateVote: function(idea, user, score){
          return Vote.findOrCreate({where: {idea_id: idea, user_id: user}, defaults: {score: score}})
          .spread(function(vote, created){
            if(!created){
              vote.updateAttributes({score: score});
            }
            return {created: created, vote: vote}
          });
       }
    }
  });

  return Vote;
};