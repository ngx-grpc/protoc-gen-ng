#!/usr/bin/env node

const fs = require('fs');
const protocPlugin = require('protoc-plugin');

function main() {
  protocPlugin((parsed) => {
    fs.writeFileSync('./src/wkt.meta.json', JSON.stringify(parsed, null, 2), 'utf8');

    return [];
  });
}

main();
