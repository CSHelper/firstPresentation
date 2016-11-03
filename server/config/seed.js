/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import sqldb from '../sqldb';
var Thing = sqldb.Thing;
var User = sqldb.User;
var Problem = sqldb.Problem;
var DataSet = sqldb.Dataset;
var TutorStudent = sqldb.TutorStudent;

Thing.sync()
  .then(() => {
    return Thing.destroy({ where: {} });
  })
  .then(() => {
    Thing.bulkCreate([{
      name: 'Development Tools',
      info: 'Integration with popular tools such as Webpack, Gulp, Babel, TypeScript, Karma, '
            + 'Mocha, ESLint, Node Inspector, Livereload, Protractor, Pug, '
            + 'Stylus, Sass, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, '
            + 'AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep '
            + 'tests alongside code. Automatic injection of scripts and '
            + 'styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more '
            + 'code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript '
            + 'payload, minifies your scripts/css/images, and rewrites asset '
            + 'names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku '
            + 'and openshift subgenerators'
    }]);
  });

User.sync()
  .then(() => User.destroy({ where: {} }))
  .then(() => {
    User.bulkCreate([{
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    }, {
      _id: 1,
      provider: 'local',
      name: 'Frank Sanchez',
      email: 'fsanchez@example.com',
      password: 'test'
    }, {
      _id: 2,
      provider: 'local',
      name: 'Nghia Tran',
      email: 'ntran@example.com',
      password: 'test'
    }, {
      _id: 3,
      provider: 'local',
      name: 'Sunny Aroh',
      email: 'saroh@example.com',
      password: 'test'
    }, {
      _id: 4,
      provider: 'local',
      name: 'Dustin Cox',
      email: 'dcox@example.com',
      password: 'test'
    }, {
      _id: 5,
      provider: 'local',
      name: 'Tommy Shay',
      email: 'tshay@example.com',
      password: 'test'
    }, {
      _id: 6,
      provider: 'local',
      role: 'tutor',
      name: 'Eric Gerardi',
      email: 'egarardi@example.com',
      password: 'test'
    }])
    .then(() => {
      console.log('finished populating users');
      TutorStudent.sync()
        .then(() => {
          return TutorStudent.destroy({ where: {} });
        })
        .then(() => {
          TutorStudent.bulkCreate([{
              tutorId: 6,
              studentId: 1
            }, {
              tutorId: 6,
              studentId: 2
            }, {
              tutorId: 6,
              studentId: 3
            }, {
              tutorId: 6,
              studentId: 4
            }, {
              tutorId: 6,
              studentId: 5
            }]);
        });
    });
  });

Problem.sync()
  .then(() => Problem.destroy({ where: {} }))
  .then(() => {
    Problem.bulkCreate([{
      _id: 1,
      title: 'Addition',
      language: 'c',
      description: 'Create code to add two integers together and produce output',
      template: `int addition(int a, int b) {


  return 0;
}`,
      functionName: 'addition'
        
    }])
    .then(() => {
      console.log('finished populating problems');
      DataSet.sync()
        .then(() => DataSet.destroy({ where: {} }))
        .then(() => {
          DataSet.bulkCreate([{
            input: {
              input1:{
                value:2,dataType:'int'
              },
              input2:{
                value:3,dataType: 'int'
              }
            },
            output: {
              value:5,dataType: 'int'
            },
            problemId: 1

          }])
          .then(() => {
            console.log('finished populating problems');
          });
        });

    });
  });

  