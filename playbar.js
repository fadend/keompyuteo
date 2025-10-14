const MIN_RATE = 0.2;
const MAX_RATE = 1.4;

class PlayBar {
  constructor(parentElem) {
    this.defaultPhrase = "안녕하세요";
    parentElem.innerHTML = "";
    this.playButton = document.createElement("button");
    this.playButton.classList.add("game-button");
    this.playButton.textContent = "🗣 Play";
    this.playButton.addEventListener("click", () => {
      this.speak(this.defaultPhrase);
    });
    parentElem.appendChild(this.playButton);
    this.voiceSelect = document.createElement("select");
    this.voiceSelect.classList.add("voices");
    parentElem.appendChild(this.voiceSelect);
    const speedLabel = document.createElement("label");
    speedLabel.textContent = "Speed: ";
    speedLabel.classList.add("speech-speed-label");
    this.rateInput = document.createElement("input");
    this.rateInput.classList.add("speech-speed");
    this.rateInput.type = "range";
    this.rateInput.min = 1;
    this.rateInput.max = 100;
    this.rateInput.value = 50;
    this.rateInput.addEventListener("change", () => {
      this.rateInput.title = `Speed: ${this.getRate()}x`;
    });
    speedLabel.appendChild(this.rateInput);
    parentElem.appendChild(speedLabel);
    this.updateVoices();
    // Chrome may fetch the voices asynchronously. Also listen for a
    // change in the available voices, potentially triggered by our
    // first attempt to populate the list of voices.
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      this.updateVoices();
    });
  }
  setDefaultPhrase(text) {
    this.defaultPhrase = text;
  }

  updateVoices() {
    this.voices = [];
    this.voiceSelect.innerHTML = "";
    for (let voice of window.speechSynthesis.getVoices()) {
      if (/^ko-/.test(voice.lang)) {
        const option = document.createElement("option");
        // Select the first matching voice found.
        if (this.voices.length === 0) {
          option.selected = true;
        }
        this.voices.push(voice);
        option.textContent = voice.name;
        this.voiceSelect.appendChild(option);
      }
    }
  }

  getRate() {
    return (
      ((parseInt(this.rateInput.value) - 1) / 100) * (MAX_RATE - MIN_RATE) +
      MIN_RATE
    );
  }

  speak(opt_text) {
    const text = opt_text || this.defaultPhrase;
    if (this.voices.length === 0) {
      alert("Sorry! Your system doesn't support Korean text-to-speech");
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.voices[this.voiceSelect.selectedIndex];
    utterance.rate = this.getRate();
    window.speechSynthesis.speak(utterance);
  }
}
