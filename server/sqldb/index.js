/**
 * Sequelize initialization module
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize,
  sequelize: new Sequelize('CSHelper', 'newuser', 'cshelper', {logging: false})
};

// Insert models below
db.Dataset = db.sequelize.import('../api/dataset/dataset.model');
db.Problem = db.sequelize.import('../api/problem/problem.model');
db.Code = db.sequelize.import('../api/code/code.model');
db.Thing = db.sequelize.import('../api/thing/thing.model');
db.User = db.sequelize.import('../api/user/user.model');

db.Dataset.belongsTo(db.Problem, {foreignKey: 'problemId', targetKey: '_id'});

db.Code.belongsTo(db.User, {foreignKey: 'userId', targetKey: '_id'}); 
db.Code.belongsTo(db.Problem, {foreignKey: 'problemId', targetKey: '_id'}); 

module.exports = db;
