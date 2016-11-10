/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/codes              ->  index
 * POST    /api/codes              ->  create
 * POST    /api/codes/run          ->  run
 * GET     /api/codes/:id          ->  show
 * PUT     /api/codes/:id          ->  upsert
 * PATCH   /api/codes/:id          ->  patch
 * DELETE  /api/codes/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {Code,TestView} from '../../sqldb';

var fs = require('fs');
var Promise = require('bluebird');
var fs = require('fs');
Promise.promisifyAll(fs);
var spawnSync = require('spawn-sync');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.log(err)
    res.status(statusCode).send(err);
  };
}

// Gets a list of Codes
export function index(req, res) {
  return Code.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Code from the DB
export function show(req, res) {
  return Code.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Code in the DB
function write(content, fileExtension) {
  fs.writeFileSync('./log.' + fileExtension, content)
    return content;
    
}

function spawnC(res, fileExtension) {
  let consoleOutput = '';
  let complier = '';
  if (fileExtension === 'cpp') {
    complier = 'g++';
  } else {
    complier = 'gcc';
  }

  var result = spawnSync(complier,
    ['log.'+ fileExtension]);

  if (result.status !== 0) {
    consoleOutput = result.stderr.toString('utf8');
  } else {
    result = spawnSync('./a.out');
    consoleOutput = result.stdout.toString('utf8');
    consoleOutput += result.stderr.toString('utf8');
  }
  return {
    isSuccess: result.status === 0,
    consoleOutput: consoleOutput
  };
}

function spawnNode(res, fileExtension) {
  var results = {
    stderr: '',
    stdout:''
  };

  var result = spawnSync('node',
    ['log.'+ fileExtension]);

  results.stdout = result.stdout.toString('utf8');
  results.stderr = result.stderr.toString('utf8');

  return res.json(results)
}

function testData(tmp, req, res) {
  let cat = '';
  tmp.inputs = JSON.parse(tmp.inputs);
  for(let input in tmp.inputs) {
    cat +=  tmp.inputs[input].value + ',';
  }
  cat = cat.slice(0, -1);
  let unitTest = unitTestC;
  tmp.expectedOutput = JSON.parse(tmp.expectedOutput);
  unitTest = unitTest
    .replace('{{params}}', cat)
    .replace('{{expectedOutput}}', tmp.expectedOutput.value)
    .replace('{{dataType}}', tmp.expectedOutput.dataType)
    .replace('{{functionName}}', tmp.functionName)
    .replace('{{printType}}', '%d');
  unitTest = unitTest + req.body.code.content;
  write(unitTest, req.body.code.fileExtension)
  let runningOutput;
      if (req.body.code.fileExtension === 'js') {
        spawnNode(res, 'js');
      } else if (req.body.code.fileExtension === 'c' || req.body.code.fileExtension === 'cpp') {
       runningOutput = spawnC(res, req.body.code.fileExtension);
      }
      let outputs = runningOutput.consoleOutput.split('\n');
      tmp.output = outputs.pop();
      tmp.consoleOutput = outputs.join('\n');
      tmp.isSuccess = runningOutput.isSuccess;
      return tmp;
}

var unitTestC = `void main(){
  {{dataType}} output = {{functionName}}({{params}});
  printf("\\n{{printType}}", output);
  if(output != {{expectedOutput}}) {
    exit(1);
  }
  exit(0);
}
`
// Creates a new Code in the DB
export function create(req, res) {

  let tmp;
  let dataSets;
  TestView.findAll({where: {problemId: 1}})
    .then(function (results){
      dataSets = results;
      for(let i = 0; i < dataSets.length; i++)
        testData(results[i], req, res);
    })
    .then(function (result) {
      let entry = req.body.code;
      entry.isSuccess = true;
      for (let i = 0; i < dataSets.length; i++) {
        if(dataSets[i] !== true) {
          entry.isSuccess = false;
        }
      }
    
      return Code.create(entry)
    })
    .then(function(){
      let results = [];
      for (let i = 0; i < dataSets.length; i++) {
        let object = {
          isSuccess: dataSets[i].isSuccess,
          _id: dataSets[i]._id,
          consoleOutput: dataSets[i].consoleOutput,
          output: dataSets[i].output
        };
        results.push(object);
      }
      console.log(results)
      return res.json(results);
    })
    .catch(handleError(res));
}

// Upserts the given Code in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }

  return Code.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Code in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Code.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Code from the DB
export function destroy(req, res) {
  return Code.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Run code
export function run(req, res) {
  return Code.create(entry)
    .then(function(){
      
    })
}

