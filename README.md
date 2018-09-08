# pushpipe

**pushpipe** wraps a Writable node stream so that you can set up data pipes and push data individually afterwards, so the data is parsed in the pipe.

## How to Use

```javascript
'use strict';

const pushpipe = require('pushpipe');

const writableStream = //get readable stream somehow, like fs.createWriteStream

const queue = pushpipe.create();

queue.push('some data');
queue.pipe(writableStream); //this can be chained like a normal stream pipe

//...do stuff

queue.push('some more data'); //the set up pipe waits for data to be pushed

queue.end(); //explicitly close the pipe to signify it is complete
```

## Installation and Setup

Do an `npm install pushpipe` to get up and running.

## Notes
Ensure when pushing things other than strings or buffers, ensure the writable stream has `objectMode = true` set as an option.