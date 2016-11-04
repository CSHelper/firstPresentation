'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('TutorView', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    studentName: DataTypes.STRING,
    studentEmail: DataTypes.STRING,
    studentId: DataTypes.INTEGER,
    tutorId: DataTypes.INTEGER
  });
}