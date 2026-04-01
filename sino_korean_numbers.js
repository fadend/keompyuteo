const PLACES = [
  [10000, "만"],
  [1000, "천"],
  [100, "백"],
  [10, "십"],
  [1, ""],
];

const DIGITS = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];

function intToSinoKorean(x) {
  if (!Number.isInteger(x)) {
    throw new Error(`Expected integer, got: ${x}`);
  }
  // TODO: support higher numbers.
  const upperLimit = 10 * PLACES[0][0];
  if (x <= 0 || x >= upperLimit) {
    throw new Error(`Outside supported range: ${x} not in (0, ${upperLimit})`);
  }
  const parts = [];
  for (const [place, name] of PLACES) {
    const digit = parseInt(x / place) % 10;
    if (digit > 0) {
      parts.push(DIGITS[digit] + name);
    }
  }
  return parts.join("");
}
