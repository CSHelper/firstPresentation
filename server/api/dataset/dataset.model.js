'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('DataSet', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    inputs: {
      type: DataTypes.JSON,
      allowNull: false
    },
    expectedOutput: {
      type: DataTypes.JSON,
      allowNull: false
    }
  });
}
