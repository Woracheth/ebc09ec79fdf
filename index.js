const fs = require('fs');
const scan = require('./peakAndValleyScanner');

let path = process.argv[2] || './data.json';
let data = JSON.parse(fs.readFileSync(path));
let scannedResult = scan(data);
scannedResult.tradeOnce().print();
scannedResult.tradeFrequent().print();
