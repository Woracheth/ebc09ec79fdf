const data = require('./data.json');

const scan = require('./peakAndValley');

let scannedResult = scan(data);
scannedResult.tradeOnce().print();
scannedResult.tradeMany().print();
