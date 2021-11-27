const Decimal = require('decimal.js');

function trade(scanned) {
  let series = scanned.statistics;
  let trades = [];
  let buy = series[0];
  let sell = null;

  function keepTrade() {
    if (sell) {
      trades.push({ buy, sell });
      sell = null;
    }
  }

  for (let i = 1; i < series.length; i++) {
    if (series[i].closePrice <= buy.closePrice) {
      keepTrade();
      buy = series[i];
    } else if (sell === null || sell.closePrice < series[i].closePrice) {
      sell = series[i];
    }
  }
  keepTrade();

  return new TradeResult(
    trades
      .sort((a, b) =>
        new Decimal(a.sell.closePrice)
          .minus(a.buy.closePrice)
          .comparedTo(new Decimal(b.sell.closePrice).minus(b.buy.closePrice))
      )
      .slice(-1)
  );
}

class TradeResult {
  constructor(trades) {
    this.trades = trades;
  }

  print() {
    if (this.trades.length) {
      this.trades.forEach((trade) => {
        console.log(
          `ซื้อขายได้อย่างละครั้ง: ซื้อวันที่ ${trade.buy.date} ขายวันที่ ${
            trade.sell.date
          } ได้กำไร ${trade.sell.closePrice} - ${trade.buy.closePrice} = ${new Decimal(
            trade.sell.closePrice
          ).minus(trade.buy.closePrice)}`
        );
      });
    } else {
      console.log('ซื้อขายได้อย่างละครั้ง: ไม่ซื้อขาย');
    }
  }
}

module.exports = trade;
