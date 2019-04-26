#! /usr/bin/env node

const path = require('path');
console.log(process.cwd())
console.log(path.dirname('/'))
require('../src/cli');
