'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('TestView', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    input: DataTypes.JSON,
    output: DataTypes.JSON,
    functionName: DataTypes.STRING
  });
}