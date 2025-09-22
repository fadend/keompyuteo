// These are taken from https://en.wikipedia.org/wiki/Korean_language_and_computers#Hangul_in_Unicode.
const INITIAL_CONSONANTS = "ᄀᄁᄂᄃᄄᄅᄆᄇᄈᄉᄊᄋᄌᄍᄎᄏᄐᄑᄒ";
const VOWELS = "ᅡᅢᅣᅤᅥᅦᅧᅨᅩᅪᅫᅬᅭᅮᅯᅰᅱᅲᅳᅴᅵ";
const FINAL_CONSONANTS = " ᆨᆩᆪᆫᆬᆭᆮᆯᆰᆱᆲᆳᆴᆵᆶᆷᆸᆹᆺᆻᆼᆽᆾᆿᇀᇁᇂ";

const MIN_RATE = 0.2;
const MAX_RATE = 1.4;

function randomNonnegativeInt(max) {
  return parseInt(max * Math.random());
}

function randomSyllable() {
  const initial = randomNonnegativeInt(INITIAL_CONSONANTS.length);
  const medial = randomNonnegativeInt(VOWELS.length);
  const final = randomNonnegativeInt(FINAL_CONSONANTS.length);
  // See https://en.wikipedia.org/wiki/Korean_language_and_computers#Hangul_in_Unicode.
  return String.fromCharCode(588 * initial + 28 * medial + final + 44032);
}

class ListeningGame {
  constructor(gameElem) {
    this.newListenButton = gameElem.querySelector("#new-listen-button");
    this.newListenButton.addEventListener("click", () => {
      this.newListeningRound();
      this.speakCorrectSyllable();
    });
    this.playButton = gameElem.querySelector("#play-button");
    this.playButton.addEventListener("click", () =>
      this.speakCorrectSyllable(),
    );
    this.guessLabels = document.querySelectorAll(".listen-guess-label");
    for (let label of this.guessLabels) {
      label.querySelector("input").addEventListener("click", () => {
        this.speakLabel(label);
      });
    }
    this.voiceSelect = gameElem.querySelector("#voices");
    this.updateVoices();
    // Chrome may fetch the voices asynchronously. Also listen for a
    // change in the available voices, potentially triggered by our
    // first attempt to populate the list of voices.
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      this.updateVoices();
    });
    this.rateInput = gameElem.querySelector("#speech-speed");
    this.rateInput.addEventListener("change", () => {
      this.rateInput.title = `Speed: ${this.getRate()}x`;
    });
    this.correctSyllable = "";
    this.newListeningRound();
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

  newListeningRound() {
    const syllablesSet = new Set();
    while (syllablesSet.size < this.guessLabels.length) {
      syllablesSet.add(randomSyllable());
    }
    const syllables = [...syllablesSet];
    syllables.sort();
    const correctIndex = randomNonnegativeInt(this.guessLabels.length);
    this.correctSyllable = syllables[correctIndex];
    this.guessLabels.forEach((label, index) => {
      label.classList.remove("correct");
      if (correctIndex === index) {
        label.classList.add("correct");
      }
      const syllable = syllables[index];
      label.querySelector(".guess").textContent = syllable;
      label.querySelector("input").checked = false;
    });
  }

  speakLabel(label) {
    const syllable = label.querySelector(".guess").textContent;
    if (!syllable) {
      console.log("Missing syllable for label");
      return;
    }
    this.speak(syllable);
  }

  speakCorrectSyllable() {
    this.speak(this.correctSyllable);
  }

  speak(text) {
    if (this.voices.length === 0) {
      alert("Sorry! Your system doesn't support Korean text-to-speech");
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.voices[this.voiceSelect.selectedIndex];
    utterance.rate = this.getRate();
    window.speechSynthesis.speak(utterance);
  }
}

new ListeningGame(document.getElementById("listening-game"));
