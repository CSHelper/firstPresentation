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
import {Code} from '../../sqldb';

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

function spawnC(res, fileExtension) {
  var results = {
    stderr: '',
    stdout:''
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
    results.output = result.stdout.toString('utf8');
    results.output += result.stderr.toString('utf8');
  }
  return res.json(results);
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

// Creates a new Code in the DB
export function create(req, res) {


  return write(req.body.code.content, req.body.code.fileExtension)
    .then(function (){
      return Code.create(req.body.code)
    })
    .then(function (response) {
      if (req.body.code.fileExtension === 'js') {
        spawnNode(res, 'js');
      } else if (req.body.code.fileExtension === 'c' || req.body.code.fileExtension === 'cpp') {
        spawnC(res, req.body.code.fileExtension);
      }
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
