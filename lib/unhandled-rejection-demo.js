'use strict';

// this is a test for the unhandled rejection lib
// by making it fail, we are sure that it will fail when needed
// and don't have any branches that don't get run in coverage
// stats

require('./unhandled-rejection');

Promise.reject(new Error('test error'));
