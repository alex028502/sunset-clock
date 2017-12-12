#!/usr/bin/env node

/* eslint no-console: 0 */

for (const filename of require('../src/lib/file-list.json')) {
  console.log('public/' + filename);
}
