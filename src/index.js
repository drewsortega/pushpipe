'use strict';


const QueueStream = require('./queueStream');

/**
 * @description
 * creates a new QueueStream object
 * 
 * @param {Object} opts the options for creating a queue
 * @param {Number} chunkSize the size of chi
 */
module.exports.create = function create(opts) {
    return new QueueStream(opts);
};

module.exports.QueueStream = QueueStream;