// These are taken from https://en.wikipedia.org/wiki/Korean_language_and_computers#Hangul_in_Unicode.
const INITIAL_CONSONANTS = "ᄀᄁᄂᄃᄄᄅᄆᄇᄈᄉᄊᄋᄌᄍᄎᄏᄐᄑᄒ";
const VOWELS = "ᅡᅢᅣᅤᅥᅦᅧᅨᅩᅪᅫᅬᅭᅮᅯᅰᅱᅲᅳᅴᅵ";
const FINAL_CONSONANTS = " ᆨᆩᆪᆫᆬᆭᆮᆯᆰᆱᆲᆳᆴᆵᆶᆷᆸᆹᆺᆻᆼᆽᆾᆿᇀᇁᇂ";

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

function identity(x) {
  return x;
}

class ListeningGame {
  constructor(gameElem, opt_randomPhraseGenerator, opt_convertPhraseToSpoken) {
    this.randomPhraseGenerator = opt_randomPhraseGenerator || randomSyllable;
    this.convertPhraseToSpoken = opt_convertPhraseToSpoken || identity;
    this.numCorrect = 0;
    this.total = 0;
    this.alreadyGuessed = false;
    this.numCorrectDisplay = gameElem.querySelector(".num-correct");
    this.numTotalDisplay = gameElem.querySelector(".num-total");
    this.newListenButton = gameElem.querySelector("#new-listen-button");
    this.playBar = new PlayBar(gameElem.querySelector("#play-bar"));
    this.newListenButton.addEventListener("click", () => {
      this.newListeningRound();
      this.playBar.speak();
    });
    this.guessLabels = [...document.querySelectorAll(".listen-guess-label")];
    for (let label of this.guessLabels) {
      label.querySelector("input").addEventListener("click", () => {
        this.speakLabel(label);
      });
      label
        .querySelector("input")
        .addEventListener("change", () => this.updateScore());
    }

    this.correctPhrase = "";
    this.newListeningRound();
  }

  newListeningRound() {
    this.alreadyGuessed = false;
    this.total++;
    this.numTotalDisplay.textContent = this.total;
    const phraseSet = new Set();
    while (phraseSet.size < this.guessLabels.length) {
      phraseSet.add(this.randomPhraseGenerator());
    }
    const phrases = [...phraseSet];
    phrases.sort();
    const correctIndex = randomNonnegativeInt(this.guessLabels.length);
    this.correctPhrase = phrases[correctIndex];
    this.playBar.setDefaultPhrase(
      this.convertPhraseToSpoken(this.correctPhrase),
    );
    this.guessLabels.forEach((label, index) => {
      label.classList.remove("correct");
      if (correctIndex === index) {
        label.classList.add("correct");
      }
      const phrase = phrases[index];
      label.querySelector(".guess").textContent = phrase;
      label.dataset["pronunciation"] = this.convertPhraseToSpoken(phrase);
      label.querySelector("input").checked = false;
    });
  }

  updateScore() {
    const selected = this.guessLabels.filter(
      (e) => e.querySelector("input").checked,
    );
    if (this.alreadyGuessed || selected.length === 0) {
      return;
    }
    this.alreadyGuessed = true;
    if (selected[0].classList.contains("correct")) {
      this.numCorrect++;
      this.numCorrectDisplay.textContent = this.numCorrect;
    }
  }

  speakLabel(label) {
    const pronunciation = label.dataset["pronunciation"];
    if (!pronunciation) {
      console.log("Missing pronunciation for label");
      return;
    }
    this.playBar.speak(pronunciation);
  }
}
