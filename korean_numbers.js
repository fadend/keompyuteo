const ONES = [
  "",
  "하나",
  "둘",
  "셋",
  "넷",
  "다섯",
  "여섯",
  "일곱",
  "여덟",
  "아홉",
];
const TENS = [
  "",
  "열",
  "스물",
  "서른",
  "마흔",
  "쉰",
  "예순",
  "일흔",
  "여든",
  "아흔",
];

function intToKorean(x) {
  if (!Number.isInteger(x)) {
    throw new Error(`Expected integer, got: ${x}`);
  }
  if (x < 1 || x > 99) {
    throw new Error(`Outside [1, 99]: ${x}`);
  }
  return TENS[parseInt(x / 10)] + ONES[x % 10];
}
