const Decimal = require('decimal.js');

function trade(scanned) {
  let buyLowIndex = scanned.isFirstItemLocalPeak ? 1 : 0;
  let output = [];
  for (let peak = buyLowIndex + 1; peak < scanned.statistics.length; peak += 2) {
    output.push({
      buy: scanned.statistics[peak - 1],
      sell: scanned.statistics[peak],
    });
  }
  return new TradeResult(output);
}

class TradeResult {
  constructor(trades) {
    this.trades = trades;
  }

  print() {
    if (this.trades.length) {
      console.log(
        `ซื้อขายกี่ครั้งก็ได้: กำไรรวม ${Decimal.sum(
          ...this.trades.map((x) =>
            new Decimal(x.sell.closePrice).minus(x.buy.closePrice)
          )
        )}`
      );
      this.trades.forEach((trade) => {
        console.log(
          `ซื้อวันที่ ${trade.buy.date} ขายวันที่ ${trade.sell.date} ได้กำไร ${
            trade.sell.closePrice
          } - ${trade.buy.closePrice} = ${new Decimal(trade.sell.closePrice).minus(
            trade.buy.closePrice
          )}`
        );
      });
    } else {
      console.log('ซื้อขายกี่ครั้งก็ได้: ไม่ซื้อขาย');
    }
  }

  printCsv() {
    this.trades.forEach((trade) => {
      console.log(`${trade.buy.date},${trade.buy.closePrice},buy`);
      console.log(`${trade.sell.date},${trade.sell.closePrice},sell`);
    });
  }
}

module.exports = trade;
