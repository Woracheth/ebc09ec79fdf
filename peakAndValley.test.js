const scan = require('./peakAndValley');

test('1st item should be valley', () => {
  let input = [
    { date: '2021-01-01', closePrice: 11.0 },
    { date: '2021-01-02', closePrice: 11.0 },
    { date: '2021-01-03', closePrice: 11.0 },
    { date: '2021-01-04', closePrice: 15.0 },
  ];
  expect(scan(input).isFirstItemLocalPeak).toBe(false);
});

test('1st item should be peak', () => {
  let input = [
    { date: '2021-01-01', closePrice: 11.0 },
    { date: '2021-01-02', closePrice: 11.0 },
    { date: '2021-01-04', closePrice: 10.0 },
  ];
  expect(scan(input).isFirstItemLocalPeak).toBe(true);
});

test('1st item should be plateau', () => {
  let input = [
    { date: '2021-01-01', closePrice: 11.0 },
    { date: '2021-01-02', closePrice: 11.0 },
    { date: '2021-01-04', closePrice: 11.0 },
  ];
  expect(scan(input).isFirstItemLocalPeak).toBe(null);
});

test('2nd item should be local peak', () => {
  let input = [
    { date: '2021-01-01', closePrice: 11.0 },
    { date: '2021-01-02', closePrice: 11.0 },
    { date: '2021-01-03', closePrice: 15.0 },
  ];
  expect(scan(input).statistics[1].closePrice).toBe(15);
});

test('first peak should be appended', () => {
  let input = [
    { date: '2021-01-01', closePrice: 11.0 },
    { date: '2021-01-02', closePrice: 15.0 },
  ];
  expect(scan(input).statistics[1].closePrice).toBe(15);
});

test('first valley should be replaced', () => {
  let input = [
    { date: '2021-01-01', closePrice: 11.0 },
    { date: '2021-01-02', closePrice: 11.0 },
    { date: '2021-01-03', closePrice: 10.0 },
    { date: '2021-01-04', closePrice: 9.0 },
    { date: '2021-01-05', closePrice: 15.0 },
  ];
  expect(scan(input).statistics[1].closePrice).toBe(9);
});

test('there should be peak on even item (odd index)', () => {
  let input = [
    { date: '2021-01-01', closePrice: 11.0 },
    { date: '2021-01-02', closePrice: 11.0 },
    { date: '2021-01-03', closePrice: 15.0 },
    { date: '2021-01-04', closePrice: 16.0 },
    { date: '2021-01-05', closePrice: 14.0 },
    { date: '2021-01-06', closePrice: 11.0 },
    { date: '2021-01-07', closePrice: 15.0 },
    { date: '2021-01-08', closePrice: 14.0 },
  ];
  let statistics = scan(input).statistics;
  for (let i = 1; i < statistics.length; i += 2) {
    expect(statistics[i].closePrice > statistics[i - 1].closePrice).toBeTruthy();
  }
});

test('there should be valley on odd item (even index)', () => {
  let input = [
    { date: '2021-01-01', closePrice: 11.0 },
    { date: '2021-01-02', closePrice: 11.0 },
    { date: '2021-01-03', closePrice: 15.0 },
    { date: '2021-01-04', closePrice: 16.0 },
    { date: '2021-01-05', closePrice: 14.0 },
    { date: '2021-01-06', closePrice: 11.0 },
    { date: '2021-01-07', closePrice: 15.0 },
    { date: '2021-01-08', closePrice: 14.0 },
  ];
  let statistics = scan(input).statistics;
  for (let i = 1; i < statistics.length; i += 2) {
    if (i + 1 < statistics.length)
      expect(statistics[i + 1].closePrice < statistics[i].closePrice).toBeTruthy();
  }
});
