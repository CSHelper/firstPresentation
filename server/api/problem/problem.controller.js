/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/problems              ->  index
 * POST    /api/problems              ->  create
 * GET     /api/problems/:id          ->  show
 * PUT     /api/problems/:id          ->  upsert
 * PATCH   /api/problems/:id          ->  patch
 * DELETE  /api/problems/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {Problem} from '../../sqldb';

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
    res.status(statusCode).send(err);
  };
}

// Gets a list of Problems
export function index(req, res) {
  return Problem.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Problem from the DB
export function show(req, res) {
  return Problem.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Problem in the DB
export function create(req, res) {
  return Problem.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Problem in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }

  return Problem.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Problem in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Problem.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Problem from the DB
export function destroy(req, res) {
  return Problem.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
