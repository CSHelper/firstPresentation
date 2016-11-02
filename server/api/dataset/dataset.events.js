/**
 * Dataset model events
 */

'use strict';

import {EventEmitter} from 'events';
var Dataset = require('../../sqldb').Dataset;
var DatasetEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DatasetEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Dataset.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    DatasetEvents.emit(event + ':' + doc._id, doc);
    DatasetEvents.emit(event, doc);
    done(null);
  };
}

export default DatasetEvents;
