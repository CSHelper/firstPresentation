'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('TutorStudent', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    
  });
}
