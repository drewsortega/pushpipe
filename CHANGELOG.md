# pushpipe Changelog

## [0.1.0] - 2018-09-07
### Added
- QueueStream class that reimplements a readable stream for easier management of endings
- QueueStream pipe function that pipes previously written data and listens for more writes
- 'create' factory for QueueStream exported
- 