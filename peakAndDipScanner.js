function scan(series) {
  let firstIsPeak = null;
  let scanned = [series[0]];

  for (let i = 1; i < series.length; i++) {
    let lastPrice = scanned[scanned.length - 1].closePrice;
    if (series[i].closePrice < lastPrice) {
      keepNewLow(i);
    } else if (series[i].closePrice > lastPrice) {
      keepNewHigh(i);
    }
  }

  function keepNewHigh(scanIndex) {
    if (firstIsPeak === null) {
      firstIsPeak = false;
      scanned.push(series[scanIndex]);
    } else if (firstIsPeak === (scanned.length % 2 === 1)) {
      // first item is peak at index 0 which is even index, peaks are expected on every even index
      // last item is already a peak on even index, then next item is odd index
      // replace new high item when in synchronous, i.e. last item is already a peak
      // replace last item when: first item is peak XOR next item is odd index
      scanned[scanned.length - 1] = series[scanIndex];
    } else {
      scanned.push(series[scanIndex]);
    }
  }

  function keepNewLow(scanIndex) {
    if (firstIsPeak === null) {
      firstIsPeak = true;
      scanned.push(series[scanIndex]);
    } else if (!firstIsPeak === (scanned.length % 2 === 1)) {
      // first item is dip at index 0 which is even index, dips are expected on every even index
      // last item is already a dip on even index, then next item is odd index
      // replace new low item when in synchronous, i.e. last item is already a dip
      // replace last item when: first item is not peak XOR next item is odd index
      scanned[scanned.length - 1] = series[scanIndex];
    } else {
      scanned.push(series[scanIndex]);
    }
  }

  return new ScannedResult(firstIsPeak, scanned);
}

class ScannedResult {
  constructor(firstIsPeak, scanned) {
    this.firstIsPeak = firstIsPeak;
    this.scanned = scanned;
  }

  get fromDip() {
    return this.scanned.slice(this.firstIsPeak ? 1 : 0);
  }

  tradeOnce() {
    const trade = require('./onceTrader');
    return trade(this.fromDip);
  }

  tradeFrequent() {
    const { tradeAlternately } = require('./frequentTrader');
    return tradeAlternately(this.fromDip);
  }
}

module.exports = scan;
