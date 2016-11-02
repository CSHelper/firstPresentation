'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Problem', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING(25),
    language: DataTypes.STRING(10),
    description: DataTypes.STRING,
    template: DataTypes.STRING

  });
}
