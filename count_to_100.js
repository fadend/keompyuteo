import { intToKorean } from "./korean_numbers.js";

export default class CountTo100 {
  constructor(parentElem) {
    this.nextNumDisplay = parentElem.querySelector("#next-num");
    this.timeElapsedDisplay = parentElem.querySelector("#time-elapsed");
    this.transcriptDisplay = parentElem.querySelector("#transcript");
    this.recognizer = new SpeechRecognition();
    this.recognizer.continuous = true;
    this.recognizer.lang = "ko-KR";
    this.recognizer.interimResults = true;
    this.recognizer.maxAlternatives = 1;
    this.recognizer.onresult = (event) => this.onResult(event);
    // If the recognizer stops listening while we're still in active session,
    // try to restart it.
    this.recognizer.onend = () => {
      if (this.active) {
        this.recognizer.start();
      }
    };
    parentElem
      .querySelector("#start-button")
      .addEventListener("click", () => this.start());
    this.timer = null;
    this.active = false;
  }
  start() {
    this.setNext(1);
    this.active = true;
    this.startTimeSeconds = +new Date() / 1000;
    clearInterval(this.timer);
    this.timer = setInterval(() => this.updateElapsedTime(), 50);
    this.timeElapsedDisplay.textContent = "";
    this.transcriptDisplay.innerHTML = "";
    this.recognizer.start();
    this.lastRecognized = "";
  }
  setNext(num) {
    console.log("setNext", num);
    this.nextNum = num;
    this.nextNumDisplay.textContent = this.nextNum;
    this.expectedPhrase = intToKorean(this.nextNum);
  }
  onResult(event) {
    const results = event.results;
    const speech = results[results.length - 1][0].transcript.replace(
      /\s+/g,
      "",
    );
    if (speech == this.lastRecognized) {
      // Ignore duplicates.
      return;
    }
    this.lastRecognized = speech;
    let transcriptTag = "span";
    if (speech === this.expectedPhrase || parseInt(speech) === this.nextNum) {
      transcriptTag = "b";
      if (this.nextNum < 100) {
        this.setNext(this.nextNum + 1);
      } else {
        this.won();
      }
    } else {
      console.log(
        "Speech doesn't match: ",
        `<${speech}> <${this.expectedPhrase}>`,
      );
    }
    const tag = document.createElement(transcriptTag);
    tag.textContent = " " + speech;
    this.transcriptDisplay.appendChild(tag);
  }
  updateElapsedTime() {
    const numSeconds = parseInt(+new Date() / 1000 - this.startTimeSeconds);
    this.timeElapsedDisplay.textContent = `${numSeconds} 초`;
  }
  won() {
    clearInterval(this.timer);
    this.recognizer.abort();
    this.active = false;
  }
}
if (document.getElementById("count-to-100")) {
  new CountTo100(document.getElementById("count-to-100"));
}
