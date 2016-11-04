'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Code', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    fileExtension: DataTypes.STRING,
    content: DataTypes.STRING,
    isSuccess: DataTypes.BOOLEAN
  });
}
