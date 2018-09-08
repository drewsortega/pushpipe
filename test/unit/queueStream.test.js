'use strict';

const chai = require('chai');
const QueueStream = require('../../src/queueStream');
const BPromise = require('bluebird');
const fs = require('fs-extra');
const path = require('path');

chai.use(require('chai-as-promised'));
const expect = chai.expect;

describe('QueueStream', function() {
    it('Creating queue should pipe values pushed before and after piping', function(){
        this.timeout(10000);
        let queue = new QueueStream;
        let writeFileStream = fs.createWriteStream(path.join(__dirname, 'outputExample.txt'));
        queue.push('1');
        queue.push('2');
        queue.push('3');
        queue.pipe(writeFileStream);
        queue.push('4');
        queue.push('5');
        queue.push('6');
        queue.end();
        return expect(new BPromise((resolve, reject) => {
            writeFileStream.on('finish', resolve);
            queue.on('error', reject);
            writeFileStream.on('err', reject);
        }).then(() => {
            return fs.readFile(path.join(__dirname, 'outputExample.txt'), 'utf8');
        }).then((data) => {
            expect(data).to.equal('123456');
        })).to.eventually.be.fulfilled;
    });
});