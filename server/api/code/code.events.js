/**
 * Code model events
 */

'use strict';

import {EventEmitter} from 'events';
var Code = require('../../sqldb').Code;
var CodeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CodeEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Code.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    CodeEvents.emit(event + ':' + doc._id, doc);
    CodeEvents.emit(event, doc);
    done(null);
  };
}

export default CodeEvents;
