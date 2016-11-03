/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/codes              ->  index
 * POST    /api/codes              ->  create
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
  return fs.writeFileAsync('./log.' + fileExtension, content)
    .then(function () {
      return content;
    });
}

function spawnC(res, fileExtension, dataSet) {
  var results = {
    stderr: '',
    stdout:'',
    dataSet
  };
  var complier = '';
  if (fileExtension === 'cpp') {
    complier = 'g++';
  } else {
    complier = 'gcc';
  }

  var result = spawnSync(complier,
    ['log.'+ fileExtension]);

  if (result.status !== 0) {
    results.output = result.stderr.toString('utf8');
  } else {
    result = spawnSync('./a.out');
    results.isSuccess = result.status === 0;
    console.log(result.status);
    results.output = result.stdout.toString('utf8');
    results.output += result.stderr.toString('utf8');
  }
  return results;
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

var unitTestC = `void main(){
  {{dataType}} output = {{functionName}}({{params}});
  printf("{{printType}}", output);
  if(output != {{expectedOutput}}) {
    exit(1);
  }
  exit(0);
}
`
// Creates a new Code in the DB
export function create(req, res) {

  let tmp;

  TestView.findAll({where: {problemId: 1}})
    .then(function (results){
      tmp = results[0];
      let cat = '';
      let params = JSON.parse(tmp.input)
      for(let input in params) {
        cat +=  params[input].value+',';
      }
      cat = cat.slice(0, -1);
      let unitTest = unitTestC;
      let output = JSON.parse(tmp.output)
      unitTest = unitTest
      .replace('{{params}}',cat)
      .replace('{{expectedOutput}}',output.value)
      .replace('{{dataType}}', output.dataType)
      .replace('{{functionName}}', tmp.functionName)
      .replace('{{printType}}', '%d');
      unitTest = unitTest+req.body.code.content;
      return write(unitTest, req.body.code.fileExtension)
    })
    .then(function (response) {
      if (req.body.code.fileExtension === 'js') {
        spawnNode(res, 'js');
      } else if (req.body.code.fileExtension === 'c' || req.body.code.fileExtension === 'cpp') {
        tmp = spawnC(res, req.body.code.fileExtension);
      }
      let entry = req.body.code;
      entry.isSuccess = tmp.isSuccess;
      return Code.create(entry)
    })
    .then(function(){
      return res.json(tmp)
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
