'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Problem', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title:{ 
      type: DataTypes.STRING(25),
      allowNull: false
    },
    language: { 
      type: DataTypes.STRING(10),
      allowNull: false
    },
    description: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    template: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    functionName: { 
      type: DataTypes.STRING,
      allowNull: false
    }

  });
}
