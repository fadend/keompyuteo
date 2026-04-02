import ListeningGame, { randomNonnegativeInt } from "./keompyuteo.js";
import { intToKorean } from "./korean_numbers.js";

new ListeningGame(
  document.getElementById("korean-number-listening-game"),
  () => 1 + randomNonnegativeInt(99),
  intToKorean,
);
