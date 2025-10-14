function customPhraseGame() {
  if (!window.SpeechRecognition) {
    document.getElementById("compatibility-warning").style.display = "block";
    document.getElementById("speak-your-phrase").style.display = "none";
    return;
  }

  const recognizer = new SpeechRecognition();
  recognizer.continuous = true;
  recognizer.lang = "ko-KR";
  recognizer.interimResults = true;
  recognizer.maxAlternatives = 1;

  const playBar = new PlayBar(document.getElementById("play-bar"));
  const targetInput = document.getElementById("target-phrase");
  const heardFeedback = document.getElementById("heard");
  const listeningIndicator = document.getElementById("listening");
  const speechCheckbox = document.getElementById("speak-checkbox");
  function reset() {
    heardFeedback.innerHTML = "";
  }
  const resetButton = document.getElementById("start-over-button");
  resetButton.addEventListener("click", reset);
  speechCheckbox.addEventListener("click", () => {
    listeningIndicator.style.display = speechCheckbox.checked
      ? "inline"
      : "none";
    if (speechCheckbox.checked) {
      reset();
      recognizer.start();
    } else {
      recognizer.stop();
    }
  });

  recognizer.onresult = (event) => {
    heardFeedback.textContent = event.results[0][0].transcript;
  };

  function textUpddated() {
    const text = targetInput.value;
    document.getElementById("listening-section").style.display = text
      ? "block"
      : "none";
    playBar.setDefaultPhrase(text);
  }

  targetInput.addEventListener("change", textUpddated);
  targetInput.addEventListener("keyup", textUpddated);

  textUpddated();
  targetInput.focus();
  targetInput.select();
}

customPhraseGame();
