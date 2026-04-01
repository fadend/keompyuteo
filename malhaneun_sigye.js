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
    const dateString = `${koreanYear}년 ${koreanMonth}월 ${koreanDay}일 ${koreanTime}`;
    this.clock.textContent = dateString;
    this.playbar.setDefaultPhrase(dateString);
  }
  updateAndSpeak() {
    this.update();
    this.playbar.speak();
  }
}
if (document.querySelector("#clock-container")) {
  new TalkingClock(document.querySelector("#clock-container"));
}
