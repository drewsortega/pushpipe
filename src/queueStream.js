'use strict';


const BPromise = require('bluebird');
const util = require('util');
const { EventEmitter } = require('events');

module.exports = QueueStream;

/**
 * @description
 * Constructs a QueueStream object with use of new keyword
 */
function QueueStream() {

    EventEmitter.call(this);

    Object.defineProperties(this, {
        _data : { value: [], writable: true },
        _isPiping : { value: false, writable: true },
        _isReadable : { value: false, writable: true }
    });

}

util.inherits(QueueStream, EventEmitter);

/**
 * pushes the specified element to the stream. If the piping has not begun,
 * push it into a local array for later use.
 * @param {Any} element - the element to push to the stream
 */
QueueStream.prototype.push = function push(element) {
    if(this._isPiping){
        this.emit('data', element);
    }else{
        this._data.push(element);
    }
    if(!this._isReadable){
        this.emit('readable');
        this._isReadable = true;
    }
};

/**
 * Ends the writing of the stream and alerts the piping streams that
 * it has completed
 */
QueueStream.prototype.end = function end() {
    if(this._isPiping){
        this.emit('pre-end');
    }else{
        this.emit('end');
    }
};

/**
 * pipes a stream object from previous pushed data and any data pushed afterwards.
 * @param {WritableStream} toStream - the stream to write to
 */
QueueStream.prototype.pipe = function pipe(toStream) {

    //set piping to true so we emit data instead of storing it
    this._isPiping = true;
    this.emit('pipe');
    //TODO: check if toStream is writable

    //write all stored data to the stream
    this._data.forEach((element) => {
        toStream.write(element);
    });

    //start asyncronous call
    new BPromise((resolve, reject) => {
        //whenever we get data, push it to the stream
        this.on('data', (data) => toStream.write(data));

        //when we get the end event, resolve this promise
        this.on('pre-end', resolve);
        this.on('err', reject);
    }).then(() => {

        //TODO: check to see if this is write
        toStream.end();
        this.emit('end');
    });

    //return result stream to chain pipes
    return toStream;
};