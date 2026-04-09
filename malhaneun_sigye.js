import PlayBar from "./playbar.js";
import { intToSinoKorean } from "./sino_korean_numbers.js";
import { intToKoreanCounting } from "./korean_numbers.js";

// We put Sunday first to match Date.getDay().
const DAY_OF_WEEK = [
  // Sunday
  "일",
  // Monday
  "월",
  // Tuesday
  "화",
  // Wednesday
  "수",
  // Thursday
  "목",
  // Friday
  "금",
  // Saturday
  "토",
];

class TalkingClock {
  constructor(parentElem) {
    this.clock = parentElem.querySelector("#clock");
    this.playbar = new PlayBar(parentElem.querySelector("#play-bar"));
    setInterval(() => {
      this.updateAndSpeak();
    }, 60000);
    setInterval(() => {
      this.update();
    }, 1000);
    this.update();
  }
  update() {
    const date = new Date();
    const koreanYear = intToSinoKorean(date.getFullYear());
    const koreanMonth = intToSinoKorean(date.getMonth() + 1);
    const koreanDay = intToSinoKorean(date.getDate());
    let hour24 = date.getHours();
    if (hour24 == 0) {
      hour24 = 24;
    }
    const hour = ((hour24 - 1) % 12) + 1;
    let koreanTime = `${intToKoreanCounting(hour)}시`;
    const minutes = date.getMinutes();
    if (minutes !== 0) {
      koreanTime += ` ${intToSinoKorean(minutes)}분`;
    }
    const seconds = date.getSeconds();
    if (seconds !== 0) {
      koreanTime += ` ${intToSinoKorean(seconds)}초`;
    }
    const dayOfWeek = `${DAY_OF_WEEK[date.getDay()]}요일`;
    const dateString = `${koreanYear}년 ${koreanMonth}월 ${koreanDay}일 (${dayOfWeek})`;
    this.clock.innerHTML = dateString + "<br>" + koreanTime;
    this.playbar.setDefaultPhrase(dateString + ' ' + koreanTime);
  }
  updateAndSpeak() {
    this.update();
    this.playbar.speak();
  }
}
if (document.querySelector("#clock-container")) {
  new TalkingClock(document.querySelector("#clock-container"));
}
