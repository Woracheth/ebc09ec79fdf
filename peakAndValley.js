function scan(series) {
  let isFirstItemLocalPeak = null;
  let statistics = [series[0]];

  for (let i = 1; i < series.length; i++) {
    if (series[i].closePrice < statistics[statistics.length - 1].closePrice) {
      if (isFirstItemLocalPeak === null) {
        isFirstItemLocalPeak = true;
        statistics.push(series[i]);
      } else if (!isFirstItemLocalPeak === (statistics.length % 2 === 1)) {
        // first item is not peak => first item is valley
        // next item must be odd index => last item must be even index
        // first item which is valley must be even index to be in sync
        // last item is already valley, then replace
        statistics[statistics.length - 1] = series[i];
      } else {
        statistics.push(series[i]);
      }
    } else if (series[i].closePrice > statistics[statistics.length - 1].closePrice) {
      if (isFirstItemLocalPeak === null) {
        isFirstItemLocalPeak = false;
        statistics.push(series[i]);
      } else if (isFirstItemLocalPeak === (statistics.length % 2 === 1)) {
        // last item is already peak, then replace
        statistics[statistics.length - 1] = series[i];
      } else {
        statistics.push(series[i]);
      }
    }
  }

  return new ScannedResult(isFirstItemLocalPeak, statistics);
}

class ScannedResult {
  constructor(isFirstItemLocalPeak, statistics) {
    this.isFirstItemLocalPeak = isFirstItemLocalPeak;
    this.statistics = statistics;
  }

  tradeOnce() {
    const trade = require('./tradeOnce');
    return trade(this);
  }

  tradeMany() {
    const trade = require('./tradeMany');
    return trade(this);
  }
}

module.exports = scan;
