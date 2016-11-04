/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/tutorStudents              ->  index
 * POST    /api/tutorStudents              ->  create
 * GET     /api/tutorStudents/:id          ->  show
 * PUT     /api/tutorStudents/:id          ->  upsert
 * PATCH   /api/tutorStudents/:id          ->  patch
 * DELETE  /api/tutorStudents/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {TutorStudent,TutorView} from '../../sqldb';

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
    console.log(err);
    res.status(statusCode).send(err);
  };
}

// Gets a list of TutorStudents
export function index(req, res) {
  return TutorStudent.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single TutorStudent from the DB
export function show(req, res) {
  return TutorView.findAll({
    where: {
      tutorId: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new TutorStudent in the DB
export function create(req, res) {
  return TutorStudent.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given TutorStudent in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }

  return TutorStudent.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing TutorStudent in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return TutorStudent.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a TutorStudent from the DB
export function destroy(req, res) {
  return TutorStudent.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
